export default function TodaysBookings({ bookings }) {
  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="section-card">
      <h2 className="section-title">Today's Bookings</h2>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Employee</th>
              <th>Device</th>
              <th>Action</th>
              <th>Booking Date</th>
              <th>Time</th>
              <th>Method</th>
              <th>Courier</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="9" className="no-data">
                  No bookings scheduled for today
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.booking_id}>
                  <td>{booking.booking_id}</td>
                  <td>
                    {booking.service_requests?.employees?.full_name || 'N/A'}
                  </td>
                  <td>{booking.service_requests?.device_type || 'N/A'}</td>
                  <td>{booking.service_requests?.request_type || 'N/A'}</td>
                  <td>{formatDate(booking.booking_date)}</td>
                  <td>{formatTime(booking.booking_time)}</td>
                  <td>{booking.method || 'N/A'}</td>
                  <td>{booking.courier_name || 'N/A'}</td>
                  <td>
                    <span className="status-badge">
                      {booking.status || 'Pending'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}