import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Search, Plus, Edit, Trash } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Test, TestCategory } from "@shared/schema";

// Form schema for creating/editing a test
const testFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  price: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number",
  }),
  categoryId: z.string(),
  preparationInstructions: z.string().optional(),
});

export default function TestManagement() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  
  // Get tests and categories
  const { data: tests, isLoading: isLoadingTests } = useQuery<Test[]>({
    queryKey: ["/api/tests"],
  });
  
  const { data: categories, isLoading: isLoadingCategories } = useQuery<TestCategory[]>({
    queryKey: ["/api/test-categories"],
  });
  
  // Filter tests based on search term
  const filteredTests = tests?.filter(test => 
    test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (test.description && test.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Form for creating/editing a test
  const form = useForm<z.infer<typeof testFormSchema>>({
    resolver: zodResolver(testFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      categoryId: "",
      preparationInstructions: "",
    },
  });
  
  // Create test mutation
  const createTestMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/tests", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Test created",
        description: "The test has been created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tests"] });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error creating test",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Submit handler for creating/editing a test
  function onSubmit(values: z.infer<typeof testFormSchema>) {
    const data = {
      ...values,
      price: Number(values.price),
      categoryId: Number(values.categoryId),
    };
    
    if (editingTest) {
      // Update existing test
      // This would be implemented in a real system
      toast({
        title: "Update not implemented",
        description: "Updating tests is not available in this demo",
      });
    } else {
      // Create new test
      createTestMutation.mutate(data);
    }
  }
  
  // Open dialog for editing a test
  const handleEditTest = (test: Test) => {
    setEditingTest(test);
    form.reset({
      name: test.name,
      description: test.description || "",
      price: test.price.toString(),
      categoryId: test.categoryId.toString(),
      preparationInstructions: test.preparationInstructions || "",
    });
    setIsDialogOpen(true);
  };
  
  // Open dialog for creating a new test
  const handleNewTest = () => {
    setEditingTest(null);
    form.reset({
      name: "",
      description: "",
      price: "",
      categoryId: "",
      preparationInstructions: "",
    });
    setIsDialogOpen(true);
  };
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Test Management
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Manage diagnostic tests and categories
        </p>
      </div>
      
      <Tabs defaultValue="tests">
        <TabsList className="mb-6">
          <TabsTrigger value="tests">Tests</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        {/* Tests Tab */}
        <TabsContent value="tests">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Diagnostic Tests</CardTitle>
                <CardDescription>Manage available tests in the system</CardDescription>
              </div>
              <Button onClick={handleNewTest}>
                <Plus className="mr-2 h-4 w-4" />
                Add Test
              </Button>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="relative mb-6">
                <Input 
                  className="pl-10"
                  placeholder="Search tests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
              
              {isLoadingTests ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredTests && filteredTests.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTests.map((test) => (
                      <TableRow key={test.id}>
                        <TableCell className="font-medium">{test.name}</TableCell>
                        <TableCell>
                          {categories?.find(c => c.id === test.categoryId)?.name || "Unknown"}
                        </TableCell>
                        <TableCell>₹{test.price}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button size="icon" variant="ghost" onClick={() => handleEditTest(test)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-10">
                  <h3 className="text-lg font-medium mb-2">No Tests Found</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-4">
                    {searchTerm ? "Try a different search term" : "Start by adding your first test"}
                  </p>
                  <Button onClick={handleNewTest}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Test
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Categories Tab */}
        <TabsContent value="categories">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Test Categories</CardTitle>
                <CardDescription>Manage test categories</CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </CardHeader>
            <CardContent>
              {isLoadingCategories ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : categories && categories.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Tests</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.description || "—"}</TableCell>
                        <TableCell>
                          {tests?.filter(t => t.categoryId === category.id).length || 0}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button size="icon" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-10">
                  <h3 className="text-lg font-medium mb-2">No Categories Found</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-4">
                    Start by adding your first category
                  </p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialog for creating/editing tests */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingTest ? "Edit Test" : "Add New Test"}</DialogTitle>
            <DialogDescription>
              {editingTest 
                ? "Update the details of this diagnostic test" 
                : "Create a new diagnostic test in the system"
              }
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Test Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Complete Blood Count" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief description of the test" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories?.map(category => (
                              <SelectItem 
                                key={category.id} 
                                value={category.id.toString()}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="preparationInstructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preparation Instructions</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Instructions for patients before the test" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Special instructions for patients to prepare for this test (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createTestMutation.isPending}
                >
                  {createTestMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingTest ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    editingTest ? "Update Test" : "Create Test"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

export default function TestManagement() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Test Management</h1>
            <p className="text-muted-foreground">Manage diagnostic tests and categories</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button className="gap-1">
              <Plus className="h-4 w-4" />
              Add New Test
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search tests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Add test list and management UI */}
      </div>
    </DashboardLayout>
  );
}
