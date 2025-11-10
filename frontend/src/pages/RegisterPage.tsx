import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { mockUsers, setCurrentUser } from "@/data/mockData";
import { User } from "@/types/video";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [channelName, setChannelName] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mockUsers.find((u) => u.email === email)) {
      setError("Email already exists");
      return;
    }

    const newUser: User = {
      id: `user${Date.now()}`,
      name: channelName,
      email,
      description,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${channelName}`
    };

    mockUsers.push(newUser);
    setCurrentUser(newUser);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="bg-red-600 rounded-lg p-2">
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.582 7.186a2.51 2.51 0 0 0-1.768-1.768C18.254 5 12 5 12 5s-6.254 0-7.814.418a2.51 2.51 0 0 0-1.768 1.768C2 8.746 2 12 2 12s0 3.254.418 4.814a2.51 2.51 0 0 0 1.768 1.768C5.746 19 12 19 12 19s6.254 0 7.814-.418a2.51 2.51 0 0 0 1.768-1.768C22 15.254 22 12 22 12s0-3.254-.418-4.814zM10 15V9l5.196 3L10 15z" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Регистрация</CardTitle>
          <CardDescription className="text-center">
            Создайте свой канал
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="channelName">Название канала</Label>
              <Input
                id="channelName"
                type="text"
                placeholder="Мой канал"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Описание канала</Label>
              <Textarea
                id="description"
                placeholder="Расскажите о вашем канале..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">
              Зарегистрироваться
            </Button>
            <div className="text-sm text-center text-gray-600">
              Уже есть аккаунт?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:underline"
              >
                Войти
              </button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
