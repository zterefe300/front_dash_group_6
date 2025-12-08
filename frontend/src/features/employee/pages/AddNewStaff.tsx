import { ArrowLeft, Mail, UserPlus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { staffService } from "../../../service/employee/staffService";
import { Button } from "../../../components/common/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/common/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/common/dialog";
import { Input } from "../../../components/common/input";
import { Label } from "../../../components/common/label";

interface NewStaffMember {
  fullName: string;
  lastName: string;
  role: string;
  username: string;
  email?: string;
}

export const AddNewStaff = () => {
  const navigate = useNavigate();
  const [singleStaff, setSingleStaff] = useState<NewStaffMember>({
    fullName: "",
    lastName: "",
    role: "Delivery Coordinator",
    username: "",
    email: "",
  });

  const [sendingEmails, setSendingEmails] = useState<{ [key: number]: boolean }>({});
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [invalidEmailOpen, setInvalidEmailOpen] = useState(false);
  const [emailSentOpen, setEmailSentOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const generateUsername = (lastName: string): string => {
    if (!lastName) return "";
    const randomDigits = Math.floor(Math.random() * 90) + 10; // 10-99
    return `${lastName.toLowerCase().replace(/\s+/g, "")}${randomDigits}`;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^.{4,}@.{3,}\..{2,}$/;
    return emailRegex.test(email);
  };

  const handleSingleStaffChange = (field: keyof NewStaffMember, value: string) => {
    setSingleStaff((prev) => {
      const updated = { ...prev, [field]: value };

      // Auto-generate username when last name changes
      if (field === "lastName" && value) {
        updated.username = generateUsername(value);
      }

      return updated;
    });
  };

  const sendCredentialEmail = async (staff: NewStaffMember, showDialog: boolean = true) => {
    if (!staff.email) {
      toast.error("Email address is required to send credentials");
      return;
    }

    if (!validateEmail(staff.email)) {
      setInvalidEmailOpen(true);
      return;
    }

    // In a real app, this would make an API call to send email
    await new Promise((resolve) => setTimeout(resolve, 0)); // Simulate API call

    if (showDialog) {
      setEmailSentOpen(true);
    }
    console.log("Sending credentials email to:", staff.email);
  };

  const addStaffToList = (staff: NewStaffMember) => {
    const existingStaff = JSON.parse(localStorage.getItem("staffMembers") || "[]");
    const newStaff = {
      id: Date.now().toString(),
      fullName: staff.fullName,
      username: staff.username,
      status: "active" as const,
      dateCreated: new Date().toISOString().split("T")[0],
      lastLogin: new Date().toISOString().split("T")[0],
      role: staff.role,
    };
    const updatedStaff = [...existingStaff, newStaff];
    localStorage.setItem("staffMembers", JSON.stringify(updatedStaff));
  };

  const handleCreateSingleStaff = async () => {
    if (!singleStaff.fullName || !singleStaff.lastName) {
      toast.error("Please fill in all required fields");
      return;
    }

    setConfirmationOpen(true);
  };

  const confirmCreateStaff = async () => {
    setIsCreating(true);
    try {
      // Prepare data for API call
      const staffData = {
        username: singleStaff.username,
        firstname: singleStaff.fullName.split(' ')[0] || singleStaff.fullName,
        lastname: singleStaff.lastName,
      };

      // Call the backend API
      await staffService.createStaff(staffData);

      toast.success(`Staff account created for ${singleStaff.fullName}`);

      // Send email if email is provided
      if (singleStaff.email) {
        await sendCredentialEmail(singleStaff, false);
      }

      // Reset form
      setSingleStaff({
        fullName: "",
        lastName: "",
        role: "Delivery Coordinator",
        username: "",
        email: "",
      });

      setConfirmationOpen(false);
    } catch (error) {
      console.error("Failed to create staff:", error);
      toast.error("Failed to create staff account. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };



  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate("/employee/staff-accounts")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Staff Accounts
        </Button>
        <div>
          <h1>Add New Staff</h1>
          <p className="text-muted-foreground">Create new staff accounts for your team</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Single Account Creation */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserPlus className="h-5 w-5" />
                <span>Create Single Staff Account</span>
              </CardTitle>
              <CardDescription>
                Add an individual staff member with auto-generated credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={singleStaff.fullName}
                    onChange={(e) => handleSingleStaffChange("fullName", e.target.value)}
                    placeholder="Enter full name"
                  />
                  <p className="text-xs text-muted-foreground">Must be unique within FrontDash</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={singleStaff.lastName}
                    onChange={(e) => handleSingleStaffChange("lastName", e.target.value)}
                    placeholder="Enter last name"
                  />
                  <p className="text-xs text-muted-foreground">Used to generate username</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username (Auto-generated)</Label>
                  <Input
                    id="username"
                    value={singleStaff.username}
                    readOnly
                    className="bg-muted"
                    placeholder="Will be auto-generated"
                  />
                  <p className="text-xs text-muted-foreground">Format: lastname + 2 digits</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={singleStaff.email}
                  onChange={(e) => handleSingleStaffChange("email", e.target.value)}
                  placeholder="Enter email to send credentials"
                />
                <p className="text-xs text-muted-foreground">
                  If provided, login credentials will be sent to this email address
                </p>
              </div>

              {singleStaff.username && singleStaff.email && (
                <Card className="bg-accent/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm text-muted-foreground">Send Credentials via Email</Label>
                        <p className="text-xs text-muted-foreground">
                          Send login credentials to: {singleStaff.email}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => sendCredentialEmail(singleStaff)}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => navigate("/employee/staff-accounts")}>
                  Cancel
                </Button>
                <Button onClick={handleCreateSingleStaff} className="bg-gradient-primary">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Staff Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Staff Account Creation</DialogTitle>
            <DialogDescription>
              Are you sure you want to create a staff account for {singleStaff.fullName}?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Full Name</Label>
                <p className="font-medium">{singleStaff.fullName}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Username</Label>
                <p className="font-mono text-sm">{singleStaff.username}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Email</Label>
                <p>{singleStaff.email || "Not provided"}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmationOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmCreateStaff} className="bg-gradient-primary">
              <UserPlus className="h-4 w-4 mr-2" />
              Create Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invalid Email Dialog */}
      <Dialog open={invalidEmailOpen} onOpenChange={setInvalidEmailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invalid Email</DialogTitle>
            <DialogDescription>
              The email address you entered is invalid. Email must be in the format XXXX@XXX.XX
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setInvalidEmailOpen(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Sent Dialog */}
      <Dialog open={emailSentOpen} onOpenChange={setEmailSentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email Sent</DialogTitle>
            <DialogDescription>
              An email has been sent with credentials to {singleStaff.email}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setEmailSentOpen(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
