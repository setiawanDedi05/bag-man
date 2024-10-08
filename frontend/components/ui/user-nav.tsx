import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { authService } from "@/services/auth/auth-service";
import { toast } from "./use-toast";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { useLoadingStore } from "@/store/loading-store";

export function UserNav() {
  const { user, removeSeason } = useAuthStore();
  const { showLoading, hideLoading } = useLoadingStore();
  const router = useRouter();

  async function onClick() {
    showLoading();
    try {
      const response = await authService.logout();
      if (response.status === 200) {
        toast({
          title: "Logout Success",
          description: "see you on the bag",
        });
        removeSeason();
        router.push("/");
      } else {
        toast({
          variant: "destructive",
          title: "Logout Failed",
          description: "Something wrong",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: error.message,
      });
    }
    hideLoading()
  }

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="neutral" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              {/* <AvatarImage
                src={`/avatars/${user?.username}.png`}
                alt={`avatar-${user?.username}`}
              /> */}
              <AvatarFallback>{user?.username?.slice(0, 2)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user?.username}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onClick}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Suspense>
  );
}
