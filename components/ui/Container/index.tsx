export const Container = ({ children }: { children?: ChildrenType }) => (
  <div className="container 2xl:max-w-(--breakpoint-2xl) 2xl:mx-auto">
    {children}
  </div>
)
