interface StatCardProps {
    value: string | number
    label: string
    bgColor?: string
    textColor?: string
  }
  
  export function StatCard({ value, label, bgColor = "bg-[#4A4A4A]", textColor = "text-white" }: StatCardProps) {
    return (
      <div className={`flex flex-col items-center justify-center rounded-lg p-6 ${bgColor} ${textColor}`}>
        <span className="text-5xl font-bold">{value}</span>
        <span className="mt-2 text-lg">{label}</span>
      </div>
    )
  }
  