const Event = require("../models/Events.js");
const { NotFoundError } = require("../utils/errors");
const { pagination, sortFromQuery } = require("../utils/pagination");

// Whitelisted sort fields — never pass raw client input to .sort()
const SORT_FIELDS = new Set(["date", "createdAt", "title", "ticketPrice"]);

exports.getEvents = async (req, res) => {
  const filters = {};

  /* Coerce scalars and escape the search pattern: a raw user string inside
     $regex is both an operator-injection surface and a ReDoS risk. */
  if (req.query.category) filters.category = String(req.query.category);
  if (req.query.search) {
    const escaped = String(req.query.search)
      .slice(0, 100)
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filters.title = { $regex: escaped, $options: "i" };
  }

  const { page, pageSize, skip } = pagination(req.query);
  const sort = sortFromQuery(req.query.sort, SORT_FIELDS);

  const [items, total] = await Promise.all([
    Event.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(pageSize)
      .populate("createdBy", "name email"),
    Event.countDocuments(filters),
  ]);

  // Public catalog is effectively static — allow client/proxy caching
  res.set("Cache-Control", "public, max-age=60");

  res.json({
    items,
    page,
    page_size: pageSize,
    total,
    pages: Math.ceil(total / pageSize),
  });
};

exports.getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id).populate("createdBy", "name email");
  if (!event) throw new NotFoundError("Event not found");

  res.set("Cache-Control", "public, max-age=60");
  res.json(event);
};

exports.createEvent = async (req, res) => {
  const { title, description, date, location, category, totalSeats, ticketPrice, image } = req.body;
  const event = await Event.create({
    title,
    description,
    date,
    location,
    category,
    totalSeats,
    availableSeats: totalSeats,
    ticketPrice: ticketPrice || 0,
    image: image || "",
    createdBy: req.user.id,
  });
  res.status(201).json(event);
};

exports.updateEvent = async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!event) throw new NotFoundError("Event not found");
  res.json(event);
};

exports.deleteEvent = async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) throw new NotFoundError("Event not found");
  // DELETE semantics: 204 No Content, nothing to return
  res.status(204).end();
};
