import { Suspense } from "react"
import ProgressClient from "./ProgressClient"

export default function ProgressPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProgressClient />
    </Suspense>
  )
}