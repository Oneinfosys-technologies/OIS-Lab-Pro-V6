import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { getInitials } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || ""
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("PATCH", "/api/user/profile", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Profile</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarFallback className="text-2xl">{user ? getInitials(user.fullName) : "U"}</AvatarFallback>
                </Avatar>
                <CardTitle>{user?.fullName}</CardTitle>
                <CardDescription>{user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Username:</span>
                    <span>{user?.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{user?.email}</span>
                  </div>
                  {user?.phone && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span>{user?.phone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={isEditing ? "outline" : "default"} 
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            {isEditing ? (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input 
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone (optional)</Label>
                      <Input 
                        id="phone"
                        name="phone"
                        value={formData.phone || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      isLoading={updateProfileMutation.isPending}
                    >
                      Save Changes
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>View your account details and settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Personal Information</h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      This information is used to personalize your experience and for verification purposes.
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label>Full Name</Label>
                        <p className="mt-1">{user?.fullName}</p>
                      </div>
                      <div>
                        <Label>Email</Label>
                        <p className="mt-1">{user?.email}</p>
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <p className="mt-1">{user?.phone || "Not provided"}</p>
                      </div>
                      <div>
                        <Label>User Role</Label>
                        <p className="mt-1">{user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-2">Account Security</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage your account security settings and password
                    </p>
                    <div className="mt-4 space-y-2">
                      <Button variant="outline" className="w-full md:w-auto">Change Password</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}