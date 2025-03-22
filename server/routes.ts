import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { TEST_STATUSES } from "@shared/schema";
import { nanoid } from "nanoid";
import { generateTestInsights } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // TEST CATEGORIES

  // Get all test categories
  app.get("/api/test-categories", async (req, res) => {
    try {
      const categories = await storage.getTestCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Error fetching test categories" });
    }
  });

  // Get a specific test category
  app.get("/api/test-categories/:id", async (req, res) => {
    try {
      const category = await storage.getTestCategory(parseInt(req.params.id));
      if (!category) {
        return res.status(404).json({ message: "Test category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Error fetching test category" });
    }
  });

  // TESTS

  // Get all tests
  app.get("/api/tests", async (req, res) => {
    try {
      const tests = await storage.getTests();
      res.json(tests);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tests" });
    }
  });

  // Get a specific test
  app.get("/api/tests/:id", async (req, res) => {
    try {
      const test = await storage.getTest(parseInt(req.params.id));
      if (!test) {
        return res.status(404).json({ message: "Test not found" });
      }
      res.json(test);
    } catch (error) {
      res.status(500).json({ message: "Error fetching test" });
    }
  });

  // Get tests by category
  app.get("/api/tests/category/:categoryId", async (req, res) => {
    try {
      const tests = await storage.getTestsByCategory(parseInt(req.params.categoryId));
      res.json(tests);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tests by category" });
    }
  });

  // BOOKINGS

  // Get all bookings for current user
  app.get("/api/bookings", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const bookings = await storage.getUserBookings(req.user.id);
      
      // Get tests for each booking
      const result = await Promise.all(bookings.map(async (booking) => {
        const test = await storage.getTest(booking.testId);
        return {
          ...booking,
          test
        };
      }));
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Error fetching bookings" });
    }
  });

  // Get a specific booking
  app.get("/api/bookings/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const booking = await storage.getBooking(parseInt(req.params.id));
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Check if booking belongs to current user
      if (booking.userId !== req.user.id && req.user.role !== "admin" && req.user.role !== "superadmin") {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      // Get booking statuses
      const statuses = await storage.getBookingStatuses(booking.id);
      
      // Get test details
      const test = await storage.getTest(booking.testId);
      
      res.json({
        ...booking,
        test,
        statuses
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching booking" });
    }
  });

  // Create a new booking
  app.post("/api/bookings", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const { testId, scheduledDate, collectionType, address } = req.body;
      
      // Validate required fields
      if (!testId || !scheduledDate || !collectionType) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // If collection type is home, address is required
      if (collectionType === "home" && !address) {
        return res.status(400).json({ message: "Address is required for home collection" });
      }
      
      const booking = await storage.createBooking({
        testId,
        userId: req.user.id,
        scheduledDate: new Date(scheduledDate),
        collectionType,
        address
      });
      
      res.status(201).json(booking);
    } catch (error) {
      res.status(500).json({ message: "Error creating booking" });
    }
  });

  // REPORTS

  // Get all reports for current user
  app.get("/api/reports", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const reports = await storage.getUserReports(req.user.id);
      
      // Get tests and bookings for each report
      const result = await Promise.all(reports.map(async (report) => {
        const booking = await storage.getBooking(report.bookingId);
        const test = booking ? await storage.getTest(booking.testId) : null;
        
        return {
          ...report,
          booking,
          test
        };
      }));
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Error fetching reports" });
    }
  });

  // Get a specific report by ID
  app.get("/api/reports/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const report = await storage.getReport(parseInt(req.params.id));
      
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      // Get booking details
      const booking = await storage.getBooking(report.bookingId);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Check if report belongs to current user
      if (booking.userId !== req.user.id && req.user.role !== "admin" && req.user.role !== "superadmin") {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      // Get test details
      const test = await storage.getTest(booking.testId);
      
      res.json({
        ...report,
        booking,
        test
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching report" });
    }
  });

  // Get a report by reportId (public access with reportId)
  app.get("/api/reports/download/:reportId", async (req, res) => {
    try {
      const report = await storage.getReportByReportId(req.params.reportId);
      
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      // Check if report has expired
      if (report.expiryDate && new Date() > report.expiryDate) {
        return res.status(403).json({ message: "Report link has expired" });
      }
      
      // Get booking details
      const booking = await storage.getBooking(report.bookingId);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Get test details
      const test = await storage.getTest(booking.testId);
      
      // Get user details
      const user = await storage.getUser(booking.userId);
      
      res.json({
        ...report,
        booking,
        test,
        user: user ? {
          fullName: user.fullName,
          email: user.email,
          phone: user.phone
        } : null
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching report" });
    }
  });

  // ADMIN ROUTES
  
  // Admin middleware to check if user is admin
  const isAdmin = (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    next();
  };
  
  // Get all bookings (admin only)
  app.get("/api/admin/bookings", isAdmin, async (req, res) => {
    try {
      const bookings = await storage.getBookings();
      
      // Get tests and users for each booking
      const result = await Promise.all(bookings.map(async (booking) => {
        const test = await storage.getTest(booking.testId);
        const user = await storage.getUser(booking.userId);
        
        return {
          ...booking,
          test,
          user: user ? {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone
          } : null
        };
      }));
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Error fetching bookings" });
    }
  });
  
  // Update booking status (admin only)
  app.patch("/api/admin/bookings/:id/status", isAdmin, async (req, res) => {
    try {
      const { status, notes } = req.body;
      
      if (!status || !Object.values(TEST_STATUSES).includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const booking = await storage.getBooking(parseInt(req.params.id));
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Update booking status
      const updatedBooking = await storage.updateBookingStatus(booking.id, status);
      
      // Create booking status with notes if provided
      if (notes) {
        await storage.createBookingStatus({
          bookingId: booking.id,
          status,
          notes
        });
      }
      
      res.json(updatedBooking);
    } catch (error) {
      res.status(500).json({ message: "Error updating booking status" });
    }
  });
  
  // Create report for a booking (admin only)
  app.post("/api/admin/reports", isAdmin, async (req, res) => {
    try {
      const { bookingId, results, insights } = req.body;
      
      if (!bookingId || !results) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const booking = await storage.getBooking(bookingId);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Generate AI insights if not already provided
      let reportInsights = insights;
      if (!reportInsights && Array.isArray(results)) {
        try {
          reportInsights = await generateTestInsights(results);
        } catch (insightError) {
          console.error("Failed to generate AI insights:", insightError);
          // Continue without insights if generation fails
        }
      }
      
      // Create report
      const report = await storage.createReport({
        bookingId,
        results,
        insights: reportInsights || null
      });
      
      res.status(201).json(report);
    } catch (error) {
      res.status(500).json({ message: "Error creating report" });
    }
  });
  
  // Generate AI insights for test results
  app.post("/api/reports/generate-insights", async (req, res) => {
    try {
      const { results } = req.body;
      
      if (!results || !Array.isArray(results)) {
        return res.status(400).json({ message: "Invalid test results format" });
      }
      
      const insights = await generateTestInsights(results);
      res.json(insights);
    } catch (error) {
      console.error("Error generating insights:", error);
      res.status(500).json({ message: "Failed to generate insights" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
