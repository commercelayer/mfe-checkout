import styled from "styled-components"
import tw from "twin.macro"

export const Accordion: React.FC = () => {
  return (
    <Wrapper>
      <AccordionTab tabIndex={1} className="group">
        <AccordionTabHeader className="group">
          <AccordionTitle>Step 1</AccordionTitle>
          <AccordionIcon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </AccordionIcon>
        </AccordionTabHeader>
        <AccordionBody>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat,
            repellat amet doloribus consequuntur eos similique provident tempora
            voluptates iure quia fuga dicta voluptatibus culpa mollitia
            recusandae delectus id suscipit labore?
          </p>
        </AccordionBody>
      </AccordionTab>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw`overflow-hidden`}
`
const AccordionTab = styled.div`
  ${tw`outline-none`}
`
const AccordionTabHeader = styled.div`
  ${tw`relative flex items-center justify-between py-3 cursor-pointer transition ease duration-500 focus:bg-gray-500`}
`
const AccordionTitle = styled.div`
  ${tw`group-focus:text-gray-600 transition ease duration-500`}
`
const AccordionIcon = styled.div`
  ${tw`transform transition ease duration-500 group-focus:text-gray-900 group-focus:-rotate-180`}
`
const AccordionBody = styled.div`
  ${tw`overflow-hidden group-focus:max-h-screen max-h-0 ease duration-500`}
`
