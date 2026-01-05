package com.velon.controller.booking;

public interface BookingOperation {
    Object create(Object request);

    Object reschedule(Integer bookingId, Object request);

    Object cancel(Integer bookingId);
}
