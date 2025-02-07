import { useState } from "react"
import { Button, Col, Row, Table } from "react-bootstrap"
import Calendar from "react-calendar"

const API_URL = import.meta.env.VITE_API_URL

const SearchSingleDate = ({ userId }: { userId: number | null }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [events, setEvents] = useState<any | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const fetchEvents = async () => {
    if (!userId || typeof userId !== "number") {
      setHasSearched(false)
      return
    }
    try {
      //adjusting timezone
      const adjustedDate = new Date(selectedDate)
      adjustedDate.setMinutes(
        adjustedDate.getMinutes() - adjustedDate.getTimezoneOffset()
      )
      const dateStr = adjustedDate.toISOString().split("T")[0]

      const response = await fetch(
        `${API_URL}/event/user/${userId}/date?date=${dateStr}`,
        {
          method: "GET",
          credentials: "include",
        }
      )
      setHasSearched(true)
      if (!response.ok) {
        throw new Error(`Err ${response.status}: ${await response.text()}`)
      }
      const data = await response.json()

      const formattedEvent = {
        eventId: data.event_id,
        userId: data.user_id,
        date: data.date,
        startTime: data.start_time,
        startLunch: data.start_lunch,
        endLunch: data.end_lunch,
        endTime: data.end_time,
        userName: data.user_name,
        firstName: data.first_name,
        lastName: data.last_name,
        role: data.role,
      }

      setEvents(formattedEvent)
    } catch (error) {
      console.error("Error finding events:", error)
      setEvents(null)
    }
  }

  const formatTime = (time: string | null) => {
    if (!time) return "Not registered"
    const date = new Date(time)
    return date.toISOString().split("T")[1].split(".")[0]
  }
  return (
    <>
      <Row className="justify-content-center mt-3">
        <Col
          md={6}
          className="d-flex flex-column align-items-center text-center"
        >
          <h5 className="text-center">Select single date</h5>
          <Calendar
            onChange={(date) => setSelectedDate(date as Date)}
            value={selectedDate}
          />
        </Col>
      </Row>

      <Row className="justify-content-center mt-3">
        <Col md={6} className="text-center">
          <Button variant="dark" onClick={fetchEvents} disabled={!userId}>
            Search
          </Button>
          {hasSearched && userId && events == null && (
            <div className="mt-3">
              <p className="text-danger">Event not found for this date</p>
            </div>
          )}
        </Col>
      </Row>

      {events && (
        <Row className="mt-4">
          <Col>
            <p className="fw-bold fs-5 text-dark">
              Date: {new Date(events.date).toISOString().split("T")[0]}
            </p>
          </Col>
        </Row>
      )}

      {events && (
        <Row className="justify-content-center mt-4">
          <Col md={8}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Hour</th>
                  <th>Register</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Started</td>
                  <td>{formatTime(events.startTime)}</td>
                </tr>
                <tr>
                  <td>Started lunch</td>
                  <td>{formatTime(events.startLunch)}</td>
                </tr>
                <tr>
                  <td>Finished lunch</td>
                  <td>{formatTime(events.endLunch)}</td>
                </tr>
                <tr>
                  <td>Finished</td>
                  <td>{formatTime(events.endTime)}</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      )}
    </>
  )
}

export default SearchSingleDate
