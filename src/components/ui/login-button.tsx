import { signIn } from "@/auth"
import { Button } from "@/components/ui/button" // Assuming you have shadcn setup
import { Github } from "lucide-react"

export default function LoginButton() {
  return (
    <form
      action={async () => {
        "use server"
        // This server action triggers the GitHub OAuth flow 
        // and redirects to /dashboard upon success.
        await signIn("github", { redirectTo: "/dashboard" })
      }}
    >
      <Button type="submit" className="w-full flex items-center gap-2">
        <Github className="w-5 h-5" />
        Login with GitHub
      </Button>
    </form>
  )
}