import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/common/card';
import { Button } from '../../../components/common/button';
import { Input } from '../../../components/common/input';
import { Label } from '../../../components/common/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/common/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/common/select';
import { Textarea } from '../../../components/common/textarea';
import { Badge } from '../../../components/common/badge';
import { UserPlus, Users, ArrowLeft, Copy, Trash2, Download, Upload, Mail, Send } from 'lucide-react';
import { toast } from 'sonner';

interface NewStaffMember {
  fullName: string;
  lastName: string;
  role: string;
  username: string;
  password: string;
  email?: string;
}

export const AddNewStaff = () => {
  const navigate = useNavigate();
  const [singleStaff, setSingleStaff] = useState<NewStaffMember>({
    fullName: '',
    lastName: '',
    role: 'Delivery Coordinator',
    username: '',
    password: '',
    email: ''
  });
  
  const [bulkStaffList, setBulkStaffList] = useState<NewStaffMember[]>([]);
  const [bulkInput, setBulkInput] = useState('');

  const [sendingEmails, setSendingEmails] = useState<{ [key: number]: boolean }>({});
  const [bulkEmailInput, setBulkEmailInput] = useState('');

  const generateUsername = (lastName: string): string => {
    if (!lastName) return '';
    const randomDigits = Math.floor(Math.random() * 90) + 10; // 10-99
    return `${lastName.toLowerCase().replace(/\s+/g, '')}${randomDigits}`;
  };

  const generatePassword = (): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleSingleStaffChange = (field: keyof NewStaffMember, value: string) => {
    setSingleStaff(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-generate username when last name changes
      if (field === 'lastName' && value) {
        updated.username = generateUsername(value);
        updated.password = generatePassword();
      }
      
      return updated;
    });
  };

  const sendCredentialEmail = async (staff: NewStaffMember) => {
    if (!staff.email) {
      toast.error('Email address is required to send credentials');
      return;
    }

    // In a real app, this would make an API call to send email
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    toast.success(`Credentials sent to ${staff.email}`);
    console.log('Sending credentials email to:', staff.email);
  };

  const handleCreateSingleStaff = async () => {
    if (!singleStaff.fullName || !singleStaff.lastName) {
      toast.error('Please fill in all required fields');
      return;
    }

    // In a real app, this would make an API call
    toast.success(`Staff account created for ${singleStaff.fullName}`);
    console.log('Creating staff:', singleStaff);
    
    // Send email if email is provided
    if (singleStaff.email) {
      await sendCredentialEmail(singleStaff);
    }
    
    // Reset form
    setSingleStaff({
      fullName: '',
      lastName: '',
      role: 'Delivery Coordinator',
      username: '',
      password: '',
      email: ''
    });
  };

  const parseBulkInput = () => {
    if (!bulkInput.trim()) {
      toast.error('Please enter staff names');
      return;
    }

    const lines = bulkInput.trim().split('\n');
    const emailLines = bulkEmailInput.trim().split('\n');
    const newStaffList: NewStaffMember[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const parts = line.trim().split(',');
      if (parts.length >= 2) {
        const fullName = parts[0].trim();
        const role = parts[1].trim();
        const lastName = fullName.split(' ').pop() || fullName;
        const email = emailLines[i] ? emailLines[i].trim() : undefined;
        
        newStaffList.push({
          fullName,
          lastName,
          role,
          username: generateUsername(lastName),
          password: generatePassword(),
          email
        });
      }
    }

    setBulkStaffList(newStaffList);
    toast.success(`${newStaffList.length} staff members prepared for creation`);
  };

  const handleCreateBulkStaff = async () => {
    if (bulkStaffList.length === 0) {
      toast.error('No staff members to create');
      return;
    }

    // In a real app, this would make an API call
    toast.success(`Created ${bulkStaffList.length} staff accounts successfully`);
    console.log('Creating bulk staff:', bulkStaffList);
    
    // Send emails to those with email addresses
    const staffWithEmails = bulkStaffList.filter(staff => staff.email);
    if (staffWithEmails.length > 0) {
      toast.info(`Sending credentials to ${staffWithEmails.length} email addresses...`);
      for (const staff of staffWithEmails) {
        await sendCredentialEmail(staff);
      }
    }
    
    // Reset
    setBulkStaffList([]);
    setBulkInput('');
    setBulkEmailInput('');
  };

  const copyCredentials = (staff: NewStaffMember) => {
    const text = `Name: ${staff.fullName}\nUsername: ${staff.username}\nPassword: ${staff.password}`;
    navigator.clipboard.writeText(text);
    toast.success('Credentials copied to clipboard');
  };



  const removeStaffFromBulk = (index: number) => {
    setBulkStaffList(prev => prev.filter((_, i) => i !== index));
  };

  const exportCredentials = () => {
    const csvContent = 'Full Name,Username,Password,Role,Email\n' +
      bulkStaffList.map(staff => 
        `${staff.fullName},${staff.username},${staff.password},${staff.role},${staff.email || ''}`
      ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'staff_credentials.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Credentials exported successfully');
  };

  const sendIndividualEmail = async (staff: NewStaffMember, index: number) => {
    if (!staff.email) {
      toast.error('Email address is required');
      return;
    }

    setSendingEmails(prev => ({ ...prev, [index]: true }));
    
    try {
      await sendCredentialEmail(staff);
    } finally {
      setSendingEmails(prev => ({ ...prev, [index]: false }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate('/staff-accounts')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Staff Accounts
        </Button>
        <div>
          <h1>Add New Staff</h1>
          <p className="text-muted-foreground">
            Create new staff accounts for your team
          </p>
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
                    onChange={(e) => handleSingleStaffChange('fullName', e.target.value)}
                    placeholder="Enter full name"
                  />
                  <p className="text-xs text-muted-foreground">
                    Must be unique within FrontDash
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={singleStaff.lastName}
                    onChange={(e) => handleSingleStaffChange('lastName', e.target.value)}
                    placeholder="Enter last name"
                  />
                  <p className="text-xs text-muted-foreground">
                    Used to generate username
                  </p>
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
                  <p className="text-xs text-muted-foreground">
                    Format: lastname + 2 digits
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={singleStaff.email}
                  onChange={(e) => handleSingleStaffChange('email', e.target.value)}
                  placeholder="Enter email to send credentials"
                />
                <p className="text-xs text-muted-foreground">
                  If provided, login credentials will be sent to this email address
                </p>
              </div>

              {singleStaff.username && singleStaff.password && (
                <Card className="bg-accent/50">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3">Generated Credentials</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">Username</Label>
                        <div className="flex items-center space-x-2">
                          <Input value={singleStaff.username} readOnly className="bg-background" />
                          <Button size="sm" variant="outline" onClick={() => copyCredentials(singleStaff)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Initial Password</Label>
                        <div className="flex items-center space-x-2">
                          <Input 
                            value={singleStaff.password} 
                            type="password"
                            readOnly 
                            className="bg-background" 
                          />
                        </div>
                      </div>
                    </div>
                    
                    {singleStaff.email && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm text-muted-foreground">Email Credentials</Label>
                            <p className="text-xs text-muted-foreground">Send credentials to: {singleStaff.email}</p>
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
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => navigate('/staff-accounts')}>
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
    </div>
  );
};
