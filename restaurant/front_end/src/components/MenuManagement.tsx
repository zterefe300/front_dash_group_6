import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageUpload } from './ImageUpload';
import { Plus, Edit, Trash2, ImageIcon, Filter, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
  image?: string;
}

export function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'Margherita Pizza',
      description: 'Fresh tomato sauce, mozzarella cheese, and basil leaves',
      price: 16.99,
      category: 'Pizza',
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJnaGVyaXRhJTIwcGl6emF8ZW58MXx8fHwxNzU3MzcyOTA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      id: '2',
      name: 'Caesar Salad',
      description: 'Romaine lettuce, parmesan cheese, croutons, and caesar dressing',
      price: 12.50,
      category: 'Salads',
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWVzYXIlMjBzYWxhZHxlbnwxfHx8fDE3NTc0MDU5Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      id: '3',
      name: 'Spaghetti Carbonara',
      description: 'Creamy pasta with bacon, egg, and parmesan cheese',
      price: 18.75,
      category: 'Pasta',
      isAvailable: false,
      image: 'https://images.unsplash.com/photo-1633337474564-1d9478ca4e2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFnaGV0dGklMjBjYXJib25hcmF8ZW58MXx8fHwxNzU3NDQyNzg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      id: '4',
      name: 'Chicken Parmesan',
      description: 'Breaded chicken breast with marinara sauce and mozzarella',
      price: 24.00,
      category: 'Main Course',
      isAvailable: true,
      image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwcGFybWVzYW58ZW58MXx8fHwxNzU3NDQyNzkxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
  ]);

  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    isAvailable: true,
  });

  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Filter states
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterAvailability, setFilterAvailability] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const categories = ['Pizza', 'Pasta', 'Salads', 'Main Course', 'Appetizers', 'Desserts', 'Beverages'];

  const handleAddItem = () => {
    if (newItem.name && newItem.description && newItem.price && newItem.category) {
      const item: MenuItem = {
        id: Date.now().toString(),
        name: newItem.name,
        description: newItem.description,
        price: newItem.price,
        category: newItem.category,
        isAvailable: newItem.isAvailable ?? true,
        image: newItem.image,
      };
      setMenuItems([...menuItems, item]);
      setNewItem({ name: '', description: '', price: 0, category: '', isAvailable: true, image: undefined });
      setIsAddDialogOpen(false);
      toast.success('Menu item added successfully!');
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handleEditItem = () => {
    if (editingItem) {
      setMenuItems(menuItems.map(item => 
        item.id === editingItem.id ? editingItem : item
      ));
      setEditingItem(null);
      setIsEditDialogOpen(false);
      toast.success('Menu item updated successfully!');
    }
  };

  const handleDeleteItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
    toast.success('Menu item deleted successfully!');
  };

  const toggleAvailability = (id: string) => {
    setMenuItems(menuItems.map(item =>
      item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
    ));
  };

  // Filtered items using useMemo for performance
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      // Category filter
      const categoryMatch = filterCategory === 'all' || item.category === filterCategory;
      
      // Availability filter
      const availabilityMatch = filterAvailability === 'all' || 
        (filterAvailability === 'available' && item.isAvailable) ||
        (filterAvailability === 'unavailable' && !item.isAvailable);
      
      // Search filter
      const searchMatch = searchTerm === '' || 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      return categoryMatch && availabilityMatch && searchMatch;
    });
  }, [menuItems, filterCategory, filterAvailability, searchTerm]);

  const getItemsByCategory = () => {
    const grouped = filteredItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, MenuItem[]>);
    return grouped;
  };

  const itemsByCategory = getItemsByCategory();

  // Clear all filters
  const clearFilters = () => {
    setFilterCategory('all');
    setFilterAvailability('all');
    setSearchTerm('');
  };

  // Check if any filters are active
  const hasActiveFilters = filterCategory !== 'all' || filterAvailability !== 'all' || searchTerm !== '';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>Menu Management</h2>
          <p className="text-muted-foreground">Manage your restaurant's menu items and categories</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Add New Menu Item</DialogTitle>
              <DialogDescription>Fill in the details for your new menu item</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Item Name</Label>
                    <Input
                      id="name"
                      value={newItem.name || ''}
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      placeholder="Enter item name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newItem.description || ''}
                      onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                      placeholder="Describe the item"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={newItem.price || ''}
                      onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value) || 0})}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newItem.category || ''}
                      onValueChange={(value) => setNewItem({...newItem, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="available"
                      checked={newItem.isAvailable ?? true}
                      onCheckedChange={(checked) => setNewItem({...newItem, isAvailable: checked})}
                    />
                    <Label htmlFor="available">Available</Label>
                  </div>
                </div>
                
                <div>
                  <ImageUpload
                    value={newItem.image}
                    onChange={(value) => setNewItem({...newItem, image: value})}
                    label="Item Image"
                  />
                </div>
              </div>
              
              <Button onClick={handleAddItem} className="w-full">
                Add Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
          <CardDescription>Filter and search your menu items</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Items</Label>
                <Input
                  id="search"
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="categoryFilter">Category</Label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="availabilityFilter">Availability</Label>
                <Select value={filterAvailability} onValueChange={setFilterAvailability}>
                  <SelectTrigger>
                    <SelectValue placeholder="All items" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Items</SelectItem>
                    <SelectItem value="available">Available Only</SelectItem>
                    <SelectItem value="unavailable">Unavailable Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters} className="w-full">
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
            
            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {filterCategory !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Category: {filterCategory}
                    <button
                      onClick={() => setFilterCategory('all')}
                      className="ml-1 text-xs hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {filterAvailability !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {filterAvailability === 'available' ? 'Available' : 'Unavailable'}
                    <button
                      onClick={() => setFilterAvailability('all')}
                      className="ml-1 text-xs hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {searchTerm && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm('')}
                      className="ml-1 text-xs hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            )}
            
            {/* Results count */}
            <div className="text-sm text-muted-foreground">
              Showing {filteredItems.length} of {menuItems.length} items
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Menu Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{menuItems.length}</div>
            {hasActiveFilters && (
              <p className="text-xs text-muted-foreground">({filteredItems.length} filtered)</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-600">
              {hasActiveFilters 
                ? filteredItems.filter(item => item.isAvailable).length
                : menuItems.filter(item => item.isAvailable).length}
            </div>
            {hasActiveFilters && (
              <p className="text-xs text-muted-foreground">
                ({menuItems.filter(item => item.isAvailable).length} total)
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Unavailable</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-red-600">
              {hasActiveFilters 
                ? filteredItems.filter(item => !item.isAvailable).length
                : menuItems.filter(item => !item.isAvailable).length}
            </div>
            {hasActiveFilters && (
              <p className="text-xs text-muted-foreground">
                ({menuItems.filter(item => !item.isAvailable).length} total)
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{Object.keys(itemsByCategory).length}</div>
            {hasActiveFilters && (
              <p className="text-xs text-muted-foreground">
                ({categories.length} total)
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Menu Items by Category */}
      <div className="space-y-6">
        {Object.keys(itemsByCategory).length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Filter className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg mb-2">No items found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {hasActiveFilters 
                  ? "No menu items match your current filters. Try adjusting your search criteria."
                  : "No menu items available. Add your first menu item to get started."
                }
              </p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          Object.entries(itemsByCategory).map(([category, items]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle>{category}</CardTitle>
              <CardDescription>{items.length} item(s)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4>{item.name}</h4>
                          <Badge variant={item.isAvailable ? "secondary" : "destructive"}>
                            {item.isAvailable ? 'Available' : 'Unavailable'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <p className="font-medium">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={item.isAvailable}
                        onCheckedChange={() => toggleAvailability(item.id)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingItem(item);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
            <DialogDescription>Update the details for this menu item</DialogDescription>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="editName">Item Name</Label>
                    <Input
                      id="editName"
                      value={editingItem.name}
                      onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editDescription">Description</Label>
                    <Textarea
                      id="editDescription"
                      value={editingItem.description}
                      onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editPrice">Price ($)</Label>
                    <Input
                      id="editPrice"
                      type="number"
                      step="0.01"
                      value={editingItem.price}
                      onChange={(e) => setEditingItem({...editingItem, price: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editCategory">Category</Label>
                    <Select
                      value={editingItem.category}
                      onValueChange={(value) => setEditingItem({...editingItem, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <ImageUpload
                    value={editingItem.image}
                    onChange={(value) => setEditingItem({...editingItem, image: value})}
                    label="Item Image"
                  />
                </div>
              </div>
              
              <Button onClick={handleEditItem} className="w-full">
                Update Item
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}