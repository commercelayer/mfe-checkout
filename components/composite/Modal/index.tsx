import classNames from "classnames"
import { useCallback, useEffect, useRef } from "react"
import styled from "styled-components"

const StyledModal = styled.div<{ show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 999;
  display: ${(props) => (props.show ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`

const ModalInner = styled.div`
  background-color: #fff;
  padding: 2.5rem;
`

interface ModalProps {
  show: boolean
  children?: React.ReactNode
  onClose?: () => void
}

export const Modal: React.FC<ModalProps> = ({ children, show, onClose }) => {
  const ref = useRef<HTMLDivElement>(null)
  const escFunction = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      if (onClose) {
        onClose()
      }
    }
  }, [])

  const outsideClickFunction = useCallback((event: MouseEvent) => {
    if (event.target === ref.current) {
      if (onClose) {
        onClose()
      }
    }
  }, [])

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false)
    ref.current?.addEventListener("click", outsideClickFunction, false)

    return () => {
      document.removeEventListener("keydown", escFunction, false)
      ref.current?.removeEventListener("click", outsideClickFunction, false)
    }
  }, [escFunction])

  return (
    <StyledModal
      ref={ref}
      show={show}
      className={classNames({ visible: show })}
    >
      <ModalInner>{children}</ModalInner>
    </StyledModal>
  )
}
