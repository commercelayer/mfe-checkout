export const ExpiredIcon: React.FC = () => {
  return (
    <svg
      className="errormark"
      viewBox="0 0 154 154"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Expired icon</title>
      <circle
        cx="77"
        cy="77"
        r="77"
        fill="none"
        className="errormark__circle"
      />
      <line
        x1="47.7071"
        y1="46.2929"
        x2="107.707"
        y2="106.293"
        stroke="white"
        stroke-width="2"
        className="errormark__line"
      />
      <line
        x1="107.707"
        y1="47.7071"
        x2="47.7071"
        y2="107.707"
        stroke="white"
        stroke-width="2"
      />
    </svg>
  )
}
