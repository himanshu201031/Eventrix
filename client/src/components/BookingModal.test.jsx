import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookingModal from './BookingModal';
import ConfettiSideCannons from './Confetti';
import { AuthContext } from '../context/auth';

const { postMock, confettiMock } = vi.hoisted(() => ({
    postMock: vi.fn(),
    confettiMock: vi.fn(),
}));

// Mock the axios client: the wizard calls api.post('/bookings/send-otp') and
// api.post('/bookings') to advance. jsdom has no real canvas either, so
// canvas-confetti is a spy we assert against.
vi.mock('../utils/axios', () => ({
    default: { post: postMock },
}));

vi.mock('canvas-confetti', () => ({
    default: confettiMock,
}));

const event = {
    _id: 'evt_1',
    title: 'Neon Nights EDM Festival',
    ticketPrice: 1500,
};

const authValue = { user: { name: 'Test User', email: 'test@eventrix.com' } };

const renderModal = () =>
    render(
        <AuthContext.Provider value={authValue}>
            <BookingModal event={event} onClose={vi.fn()} />
        </AuthContext.Provider>
    );

/** Walk the wizard through step 5 (OTP entered, not yet confirmed). */
async function walkToOtpStep(user) {
    renderModal();
    await user.click(screen.getByRole('button', { name: /Next: select seats/i }));
    await user.click(screen.getByRole('button', { name: /Next: review order/i }));
    await user.click(screen.getByRole('button', { name: /Next: payment method/i }));
    await user.click(screen.getByRole('button', { name: /Send OTP verification/i }));
    await user.type(screen.getByPlaceholderText('000000'), '123456');
}

/** Confirm the booking (step 5 -> 6), where the success state mounts. */
async function confirmBooking(user) {
    await user.click(screen.getByRole('button', { name: /Verify OTP & confirm/i }));
}

describe('BookingModal — booking success path', () => {
    beforeEach(() => {
        postMock.mockReset();
        postMock.mockResolvedValue({ data: { ok: true } });
        confettiMock.mockClear();
    });

    // Explicit cleanup: vitest globals are off in this project, so RTL's
    // auto-cleanup (registered on global afterEach) never fires.
    afterEach(cleanup);

    it('fires confetti only when the booking succeeds, not earlier', async () => {
        const user = userEvent.setup();
        await walkToOtpStep(user);

        // Nothing has fired while walking the wizard (this test runs first,
        // so no prior mount's side-cannon loop can interfere).
        expect(confettiMock).not.toHaveBeenCalled();

        await confirmBooking(user);

        // The success step mounts ConfettiSideCannons, which fires its burst
        // ~250ms later — waitFor catches it.
        await waitFor(() => expect(confettiMock).toHaveBeenCalled());
        expect(screen.getByText('Booking requested!')).toBeInTheDocument();
    });

    it('renders the success state with the booked event after completing the wizard', async () => {
        const user = userEvent.setup();
        await walkToOtpStep(user);
        await confirmBooking(user);

        // The POST that books the event fired with the order details.
        expect(postMock).toHaveBeenCalledWith('/bookings', expect.objectContaining({
            eventId: 'evt_1',
            quantity: 1,
            ticketTier: 'general',
            otp: '123456',
        }));

        // Success state renders.
        expect(await screen.findByText('Booking requested!')).toBeInTheDocument();
        expect(screen.getByText(/has been submitted/i)).toBeInTheDocument();
        // Event title appears in the header and in the success copy.
        expect(screen.getAllByText('Neon Nights EDM Festival').length).toBeGreaterThanOrEqual(2);
        expect(screen.getByRole('button', { name: /Close & view dashboard/i })).toBeInTheDocument();
        // Progress indicator moved to the final step.
        expect(screen.getByText(/Step 6 of 6/i)).toBeInTheDocument();
    });

    it('replays confetti when remounted with a new key (per-booking replay)', () => {
        // BookingModal renders <ConfettiSideCannons key={celebrationId} />, so
        // a new booking (new key) must remount and fire again.
        vi.useFakeTimers();
        try {
            const { rerender } = render(
                <ConfettiSideCannons durationMs={16} delayMs={0} />
            );
            vi.advanceTimersByTime(10);
            expect(confettiMock).toHaveBeenCalled();

            confettiMock.mockClear();
            rerender(<ConfettiSideCannons key="booking-2" durationMs={16} delayMs={0} />);
            vi.advanceTimersByTime(10);
            expect(confettiMock).toHaveBeenCalled();
        } finally {
            vi.useRealTimers();
        }
    });
});
