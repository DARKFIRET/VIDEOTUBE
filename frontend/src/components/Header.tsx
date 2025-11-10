import { Menu, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-2 gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="bg-red-600 rounded-lg p-1.5">
              <svg
                className="w-6 h-6 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M21.582 7.186a2.51 2.51 0 0 0-1.768-1.768C18.254 5 12 5 12 5s-6.254 0-7.814.418a2.51 2.51 0 0 0-1.768 1.768C2 8.746 2 12 2 12s0 3.254.418 4.814a2.51 2.51 0 0 0 1.768 1.768C5.746 19 12 19 12 19s6.254 0 7.814-.418a2.51 2.51 0 0 0 1.768-1.768C22 15.254 22 12 22 12s0-3.254-.418-4.814zM10 15V9l5.196 3L10 15z" />
              </svg>
            </div>
            <span className="font-bold text-xl hidden sm:inline">VideoHub</span>
          </div>
        </div>

        <div className="flex-1 max-w-2xl">
          <div className="flex items-center">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search"
                className="w-full pr-10 border-gray-300 focus:border-blue-500"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
              >
                <Search className="h-5 w-5 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/profile")}
            className="rounded-full"
          >
            <User className="h-5 w-5" />
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => navigate("/login")}
          >
            Войти
          </Button>
        </div>
      </div>
    </header>
  );
}