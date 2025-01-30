import { useState } from "react"
import { useEvent } from "../context/useEvent"
import { Button } from "react-bootstrap"
import ConfirmModal from "./ConfirmModal"

interface StartTimeProps {
  userId: number
}

const StartTimeButton = ({ userId }: StartTimeProps) => {
  const { setEventId } = useEvent()
  const [showModal, setShowModal] = useState(false)

  const handleStart = async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/api/v1/event/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userID: userId }),
          credentials: "include",
        }
      )

      if (!response.ok) {
        // Verifique o status HTTP e a mensagem de erro retornada
        const errorMessage = await response.json() // Caso o backend retorne texto puro
        console.error("Backend error:", errorMessage)

        // Personalize a mensagem com base na resposta
        if (
          errorMessage.error &&
          errorMessage.error.includes("Duplicate entry")
        ) {
          alert("Start time already registered.")
          return
        }
      }
      // Se sucesso
      const data = await response.json()

      setEventId(data.eventId)
      // Atualiza o eventId no contexto

      setTimeout(() => {
        alert(`Event created successfully! Start time: ${data.startTime}`)
      }, 500)
    } catch (error) {
      // Erro genérico
      console.error("Error submitting event:", error)
      alert("An unexpected error occurred. Please try again.")
    }
  }

  return (
    <>
      <Button className="bg-dark mx-1" onClick={() => setShowModal(true)}>
        Start time
      </Button>
      <ConfirmModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={() => {
          setShowModal(false)
          handleStart()
        }}
        title="Confirm Start Time"
        body="Do you confirm starting time?"
      ></ConfirmModal>
    </>
  )
}

export default StartTimeButton
