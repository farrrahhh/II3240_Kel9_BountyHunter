interface NavbarProps {
    title: string
    bgColor?: string
    textColor?: string
  }
  
  export function Navbar({ title, bgColor = "bg-[#A6CE39]", textColor = "text-white" }: NavbarProps) {
    return (
      <header className={`flex h-16 items-center px-6 ${bgColor} ${textColor}`}>
        <h1 className="text-2xl font-bold">{title}</h1>
      </header>
    )
  }
  