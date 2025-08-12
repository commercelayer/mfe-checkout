export const CheckIcon: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 154 154"
      className="icon-order-success"
    >
      <title>Success icon</title>
      <g fill="none" stroke="#1FDA8A" strokeWidth="2">
        <circle cx="77" cy="77" r="72" className="circle" />
        <circle
          className="colored_circle"
          fill="#1FDA8A"
          cx="77"
          cy="77"
          r="72"
        />
        <polyline
          className="checkmark"
          stroke="#fff"
          strokeWidth="5"
          points="43.5,77.8 63.7,97.9 112.2,49.4 "
        />
      </g>
    </svg>
  )
}
