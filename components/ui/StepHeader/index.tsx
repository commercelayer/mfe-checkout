import styled from "styled-components"
import tw from "twin.macro"

interface Props {
  status: "edit" | "done" | "disabled"
  label: string
  info: string
  stepNumber?: number
  onEditRequest?: () => void
}

export const StepHeader: React.FC<Props> = ({
  status,
  label,
  info,
  stepNumber,
  onEditRequest,
}) => {
  return (
    <div tw="flex items-start px-4">
      <Badge>{status === "done" ? "OK" : stepNumber}</Badge>
      <div tw={"pl-3"}>
        <div>
          <span tw="text-lg">{label}</span>
          {status === "done" ? (
            <div>
              <button onClick={onEditRequest}>Edit</button>
            </div>
          ) : null}
        </div>
        <div tw={"text-gray-400"}>{info}</div>
      </div>
    </div>
  )
}

const Badge = styled.div`
  ${tw`mt-1 rounded-full	bg-blue-400 text-white flex justify-center items-center w-6 h-6 text-xs font-bold`}
`
