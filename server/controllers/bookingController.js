const Booking = require("../models/booking.js");
const Event = require("../models/Events.js");
const OTP = require("../models/Otp.js");
const { sendBookingEmail, sendOtpEmail } = require("../utils/email.js");
const { pagination } = require("../utils/pagination");
const {
  ValidationError,
  NotFoundError,
  ConflictError,
  ForbiddenError,
} = require("../utils/errors");

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.sendBookingOTP = async (req, res) => {
  const otp = generateOTP();
  await OTP.findOneAndDelete({ email: req.user.email, action: "event_booking" });
  await OTP.create({ email: req.user.email, otp, action: "event_booking" });
  await sendOtpEmail(req.user.email, otp, "event_booking");
  res.json({ message: "OTP sent successfully" });
};

exports.bookEvent = async (req, res) => {
  const { eventId, otp } = req.body;

  // Verify OTP explicitly before proceeding
  const validOTP = await OTP.findOne({ email: req.user.email, otp, action: "event_booking" });
  if (!validOTP) {
    throw new ValidationError("Invalid or expired OTP for booking");
  }

  const event = await Event.findById(eventId);
  if (!event) throw new NotFoundError("Event not found");
  if (event.availableSeats <= 0) {
    throw new ValidationError("No seats available");
  }

  const existingBooking = await Booking.findOne({ userId: req.user.id, eventId });
  if (existingBooking && existingBooking.status !== "cancelled") {
    throw new ConflictError("Already booked or pending");
  }

  const booking = await Booking.create({
    userId: req.user.id,
    eventId,
    status: "pending",
    paymentStatus: "not_paid",
    amount: event.ticketPrice,
  });

  await OTP.deleteOne({ _id: validOTP._id }); // cleanup

  res.status(201).json({ message: "Booking request submitted", booking });
};

exports.confirmBooking = async (req, res) => {
  const { paymentStatus } = req.body; // 'paid' or 'not_paid'
  // Never echo the password hash back to clients
  const booking = await Booking.findById(req.params.id)
    .populate("userId", "-password")
    .populate("eventId");
  if (!booking) throw new NotFoundError("Booking not found");

  if (booking.status === "confirmed") {
    throw new ConflictError("Booking is already confirmed");
  }

  const event = await Event.findById(booking.eventId._id);
  if (event.availableSeats <= 0) {
    throw new ValidationError("No seats available to confirm this booking");
  }

  booking.status = "confirmed";
  if (paymentStatus) {
    booking.paymentStatus = paymentStatus;
  }
  await booking.save();

  event.availableSeats -= 1;
  await event.save();

  // Send email on admin confirmation
  await sendBookingEmail(
    booking.userId.email,
    booking.userId.username || booking.userId.name,
    booking.eventId.title
  );

  res.json({ message: "Booking confirmed successfully", booking });
};

exports.getMyBookings = async (req, res) => {
  const { page, pageSize, skip } = pagination(req.query);

  const filter = req.user.role === "admin" ? {} : { userId: req.user.id };

  const [items, total] = await Promise.all([
    Booking.find(filter)
      .populate("eventId")
      .populate("userId", "username email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize),
    Booking.countDocuments(filter),
  ]);

  res.json({
    items,
    page,
    page_size: pageSize,
    total,
    pages: Math.ceil(total / pageSize),
  });
};

exports.cancelBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new NotFoundError("Booking not found");
  if (booking.userId.toString() !== req.user.id && req.user.role !== "admin") {
    throw new ForbiddenError("Not authorized");
  }
  if (booking.status === "cancelled") {
    throw new ConflictError("Already cancelled");
  }

  const wasConfirmed = booking.status === "confirmed";

  booking.status = "cancelled";
  await booking.save();

  // Only restore the seat if it was actually confirmed and deducted
  if (wasConfirmed) {
    const event = await Event.findById(booking.eventId);
    if (event) {
      event.availableSeats += 1;
      await event.save();
    }
  }

  // DELETE semantics: 204 No Content, nothing to return
  res.status(204).end();
};
