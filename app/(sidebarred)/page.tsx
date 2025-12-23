import Link from "next/link"

export default function HomePage() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <h1 className="text-2xl">Under development, take diversion to <Link href={"/dashboard"} className="underline text-blue-500">Dashboard</Link></h1>
    </div>
  )
}
