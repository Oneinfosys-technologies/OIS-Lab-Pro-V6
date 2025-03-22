import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, Search, Building2, UserPlus, Package, BadgeCheck, 
  AlertCircle, ArrowUpRight, Settings 
} from "lucide-react";

// SuperAdmin Dashboard
export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // Redirect if not superadmin
  if (user && user.role !== "superadmin") {
    setLocation("/");
    return null;
  }

  const createNewLab = () => {
    toast({
      title: "Coming Soon",
      description: "Lab creation functionality will be available in the next update.",
    });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">SuperAdmin Dashboard</h1>
            <p className="text-muted-foreground">Manage multiple labs and system settings</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={createNewLab}
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              Add New Lab
            </Button>
            <Button variant="outline" className="gap-1">
              <Settings className="h-4 w-4" />
              System Settings
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 lg:grid-cols-5 w-full md:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="labs">Labs</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <DashboardCard
                title="Total Labs"
                value="5"
                description="Active labs in the system"
                icon={<Building2 className="h-5 w-5" />}
                change="+1 this month"
                positive={true}
              />
              <DashboardCard
                title="Active Subscriptions"
                value="4"
                description="Current paid subscriptions"
                icon={<Package className="h-5 w-5" />}
                change="-1 from last month"
                positive={false}
              />
              <DashboardCard
                title="Total Users"
                value="125"
                description="Registered users across all labs"
                icon={<UserPlus className="h-5 w-5" />}
                change="+12 this month"
                positive={true}
              />
              <DashboardCard
                title="System Health"
                value="98%"
                description="Overall system performance"
                icon={<BadgeCheck className="h-5 w-5" />}
                change="Stable"
                positive={true}
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Latest system-wide activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <ActivityItem
                      title="New Lab Onboarded"
                      description="ABC Diagnostics was added to the platform"
                      time="2 hours ago"
                      icon={<Building2 className="h-4 w-4" />}
                    />
                    <ActivityItem
                      title="Subscription Renewed"
                      description="XYZ Labs renewed their premium subscription"
                      time="Yesterday"
                      icon={<Package className="h-4 w-4" />}
                    />
                    <ActivityItem
                      title="System Maintenance"
                      description="Scheduled maintenance completed successfully"
                      time="2 days ago"
                      icon={<Settings className="h-4 w-4" />}
                    />
                    <ActivityItem
                      title="New Admin User"
                      description="New admin user added for City Health Labs"
                      time="3 days ago"
                      icon={<UserPlus className="h-4 w-4" />}
                    />
                    <ActivityItem
                      title="Payment Failed"
                      description="Subscription payment failed for Metro Diagnostics"
                      time="4 days ago"
                      icon={<AlertCircle className="h-4 w-4" />}
                      alert={true}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Expiring Subscriptions</CardTitle>
                  <CardDescription>Subscriptions expiring soon</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <ExpiringSubscription
                      name="Metro Diagnostics"
                      daysLeft={5}
                      plan="Premium"
                    />
                    <ExpiringSubscription
                      name="City Health Labs"
                      daysLeft={12}
                      plan="Standard"
                    />
                    <ExpiringSubscription
                      name="XYZ Labs"
                      daysLeft={30}
                      plan="Premium"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="labs" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Registered Labs</CardTitle>
                  <CardDescription>Manage all registered laboratory facilities</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search labs..."
                      className="pl-8 w-[200px] md:w-[300px]"
                    />
                  </div>
                  <Button size="sm" onClick={createNewLab}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Lab
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 p-4 text-sm font-medium text-muted-foreground border-b">
                    <div className="col-span-4">Name</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Subscription</div>
                    <div className="col-span-2">Expiry</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>
                  <LabItem
                    name="ABC Diagnostics"
                    address="123 Main St, New York"
                    status="active"
                    subscription="Premium"
                    expiryDate="April 20, 2025"
                  />
                  <LabItem
                    name="XYZ Labs"
                    address="456 Central Ave, Los Angeles"
                    status="active"
                    subscription="Premium"
                    expiryDate="May 15, 2025"
                  />
                  <LabItem
                    name="Metro Diagnostics"
                    address="789 Market St, San Francisco"
                    status="active"
                    subscription="Premium"
                    expiryDate="March 27, 2025"
                  />
                  <LabItem
                    name="City Health Labs"
                    address="101 Park Rd, Boston"
                    status="active"
                    subscription="Standard"
                    expiryDate="April 4, 2025"
                  />
                  <LabItem
                    name="Wellness Testing Center"
                    address="202 Tech Blvd, Austin"
                    status="pending"
                    subscription="Basic"
                    expiryDate="April 22, 2025"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscriptions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SubscriptionPlanCard
                name="Basic"
                price="$99"
                period="per month"
                features={[
                  "Single lab management",
                  "Basic test reporting",
                  "Email support",
                  "5 user accounts",
                  "1000 reports/month"
                ]}
                cta="Manage Plan"
                variant="outline"
              />
              <SubscriptionPlanCard
                name="Standard"
                price="$299"
                period="per month"
                features={[
                  "Up to 3 labs management",
                  "Advanced test reporting",
                  "Email and phone support",
                  "20 user accounts",
                  "5000 reports/month",
                  "API access"
                ]}
                cta="Manage Plan"
                variant="default"
              />
              <SubscriptionPlanCard
                name="Premium"
                price="$599"
                period="per month"
                features={[
                  "Unlimited labs management",
                  "AI-powered test insights",
                  "24/7 priority support",
                  "Unlimited user accounts",
                  "Unlimited reports",
                  "Advanced API access",
                  "Custom integrations"
                ]}
                cta="Manage Plan"
                variant="premium"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Subscription Management</CardTitle>
                <CardDescription>View and manage all lab subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 p-4 text-sm font-medium text-muted-foreground border-b">
                    <div className="col-span-3">Lab Name</div>
                    <div className="col-span-2">Plan</div>
                    <div className="col-span-2">Start Date</div>
                    <div className="col-span-2">Renewal Date</div>
                    <div className="col-span-1">Status</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>
                  <SubscriptionItem
                    name="ABC Diagnostics"
                    plan="Premium"
                    startDate="Mar 20, 2025"
                    renewalDate="Apr 20, 2025"
                    status="active"
                  />
                  <SubscriptionItem
                    name="XYZ Labs"
                    plan="Premium"
                    startDate="Apr 15, 2024"
                    renewalDate="May 15, 2025"
                    status="active"
                  />
                  <SubscriptionItem
                    name="Metro Diagnostics"
                    plan="Premium"
                    startDate="Feb 27, 2025"
                    renewalDate="Mar 27, 2025"
                    status="overdue"
                  />
                  <SubscriptionItem
                    name="City Health Labs"
                    plan="Standard"
                    startDate="Mar 4, 2025"
                    renewalDate="Apr 4, 2025"
                    status="active"
                  />
                  <SubscriptionItem
                    name="Wellness Testing Center"
                    plan="Basic"
                    startDate="Mar 22, 2025"
                    renewalDate="Apr 22, 2025"
                    status="pending"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>
                  The user management functionality will be available in the next update.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-12">
                <div className="text-center space-y-4">
                  <div className="bg-primary/10 inline-flex p-6 rounded-full">
                    <UserPlus className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">User Management</h3>
                  <p className="text-muted-foreground max-w-md">
                    This section will allow you to manage all users across different labs, 
                    set permissions, and handle user-related operations.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>
                  The system settings functionality will be available in the next update.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-12">
                <div className="text-center space-y-4">
                  <div className="bg-primary/10 inline-flex p-6 rounded-full">
                    <Settings className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">System Settings</h3>
                  <p className="text-muted-foreground max-w-md">
                    This section will allow you to configure global system settings, 
                    integrations with third-party services, and manage system-wide parameters.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

// Helper Components
function DashboardCard({ title, value, description, icon, change, positive }: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  change: string;
  positive: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="bg-primary/10 p-2 rounded-full text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <div className={`text-xs mt-2 flex items-center ${positive ? 'text-green-500' : 'text-red-500'}`}>
          <ArrowUpRight className={`h-3.5 w-3.5 mr-1 ${!positive && 'rotate-180'}`} />
          <span>{change}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityItem({ title, description, time, icon, alert = false }: {
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
  alert?: boolean;
}) {
  return (
    <div className="flex items-start space-x-4 py-2 border-b last:border-0">
      <div className={`p-2 rounded-full ${alert ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'}`}>
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
        <span className="text-xs text-muted-foreground">{time}</span>
      </div>
    </div>
  );
}

function ExpiringSubscription({ name, daysLeft, plan }: {
  name: string;
  daysLeft: number;
  plan: string;
}) {
  let statusColor = 'bg-green-100 text-green-800';
  if (daysLeft <= 7) statusColor = 'bg-red-100 text-red-800';
  else if (daysLeft <= 14) statusColor = 'bg-yellow-100 text-yellow-800';

  return (
    <div className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
      <div>
        <h4 className="text-sm font-medium">{name}</h4>
        <p className="text-xs text-muted-foreground">{plan} Plan</p>
      </div>
      <div className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor}`}>
        {daysLeft} days
      </div>
    </div>
  );
}

function LabItem({ name, address, status, subscription, expiryDate }: {
  name: string;
  address: string;
  status: string;
  subscription: string;
  expiryDate: string;
}) {
  let statusColor = 'bg-green-100 text-green-800';
  if (status === 'inactive') statusColor = 'bg-red-100 text-red-800';
  else if (status === 'pending') statusColor = 'bg-yellow-100 text-yellow-800';

  return (
    <div className="grid grid-cols-12 items-center p-4 hover:bg-muted/50 border-b last:border-0">
      <div className="col-span-4">
        <h4 className="text-sm font-medium">{name}</h4>
        <p className="text-xs text-muted-foreground">{address}</p>
      </div>
      <div className="col-span-2">
        <span className={`text-xs font-medium inline-block px-2.5 py-1 rounded-full ${statusColor}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      <div className="col-span-2 text-sm">{subscription}</div>
      <div className="col-span-2 text-sm">{expiryDate}</div>
      <div className="col-span-2 text-right">
        <Button size="sm" variant="outline" className="mr-2">View</Button>
        <Button size="sm">Edit</Button>
      </div>
    </div>
  );
}

function SubscriptionItem({ name, plan, startDate, renewalDate, status }: {
  name: string;
  plan: string;
  startDate: string;
  renewalDate: string;
  status: string;
}) {
  let statusColor = 'bg-green-100 text-green-800';
  if (status === 'overdue') statusColor = 'bg-red-100 text-red-800';
  else if (status === 'pending') statusColor = 'bg-yellow-100 text-yellow-800';

  return (
    <div className="grid grid-cols-12 items-center p-4 hover:bg-muted/50 border-b last:border-0">
      <div className="col-span-3 text-sm font-medium">{name}</div>
      <div className="col-span-2 text-sm">{plan}</div>
      <div className="col-span-2 text-sm">{startDate}</div>
      <div className="col-span-2 text-sm">{renewalDate}</div>
      <div className="col-span-1">
        <span className={`text-xs font-medium inline-block px-2.5 py-1 rounded-full ${statusColor}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      <div className="col-span-2 text-right">
        <Button size="sm" variant="outline" className="mr-2">Renew</Button>
        <Button size="sm">Details</Button>
      </div>
    </div>
  );
}

interface SubscriptionPlanCardProps {
  name: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  variant: 'outline' | 'default' | 'premium';
}

function SubscriptionPlanCard({ name, price, period, features, cta, variant }: SubscriptionPlanCardProps) {
  let cardClassName = '';
  let titleClassName = 'text-xl font-bold';
  let buttonVariant: 'default' | 'outline' | 'secondary' = 'default';
  
  switch (variant) {
    case 'outline':
      cardClassName = 'border';
      buttonVariant = 'outline';
      break;
    case 'default':
      cardClassName = 'border border-primary/50 bg-primary/5';
      buttonVariant = 'default';
      break;
    case 'premium':
      cardClassName = 'border-0 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground';
      titleClassName = 'text-xl font-bold text-primary-foreground';
      buttonVariant = 'secondary';
      break;
  }

  return (
    <Card className={cardClassName}>
      <CardHeader>
        <CardTitle className={titleClassName}>{name}</CardTitle>
        <div className="mt-2">
          <span className="text-3xl font-bold">{price}</span>
          <span className="text-sm ml-1">{period}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 mr-2 mt-1 shrink-0"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        <Button className="w-full" variant={buttonVariant}>
          {cta}
        </Button>
      </CardContent>
    </Card>
  );
}