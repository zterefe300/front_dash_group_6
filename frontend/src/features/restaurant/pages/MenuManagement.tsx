import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from './ImageUpload';
import { Plus, Edit, Trash2, ImageIcon, Filter, X } from 'lucide-react';
import { toast } from 'sonner';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
  imageUrl?: string | null;
}

export function MenuManagement() {

  // TODO: Replace with real store data later
  const restaurant = { id: 'mock-restaurant-id', name: 'Mock Restaurant' };
  const isMenuLoading = false;
  const isMenuSaving = false;

  // Mock menu data
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'Margherita Pizza',
      description: 'Classic tomato sauce, mozzarella, and fresh basil',
      price: 12.99,
      category: 'Pizza',
      isAvailable: true,
      imageUrl: null,
    },
    {
      id: '2',
      name: 'Caesar Salad',
      description: 'Romaine lettuce, croutons, parmesan, and Caesar dressing',
      price: 8.99,
      category: 'Salads',
      isAvailable: true,
      imageUrl: null,
    },
  ]);

  const restaurantId = restaurant?.id ?? '';

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
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  
  // Filter states
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterAvailability, setFilterAvailability] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // -------------------- Categories (可新增) --------------------
  const [categories, setCategories] = useState<string[]>([
    'Pizza', 'Pasta', 'Salads', 'Main Course', 'Appetizers', 'Desserts', 'Beverages'
  ]);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddCategory = () => {
    const name = newCategoryName.trim();
    if (!name) {
      toast.error('Category name cannot be empty');
      return;
    }
    // 不区分大小写去重
    const exists = categories.some(c => c.toLowerCase() === name.toLowerCase());
    if (exists) {
      toast.error('Category already exists');
      return;
    }
    setCategories(prev => [...prev, name]);
    setNewCategoryName('');
    setIsAddCategoryOpen(false);
    toast.success('Category added');
    // 如需后端持久化，可在这里调用 saveCategory({ restaurantId, categoryName: name })
    // 并在成功后 refreshMenu / refreshCategories
  };
  // ------------------------------------------------------------

  const handleAddItem = () => {
    if (
      !newItem.name ||
      !newItem.description ||
      newItem.price === undefined ||
      newItem.price === null ||
      newItem.category === undefined ||
      newItem.category === ''
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Mock: Add item to local state
    const newMenuItem: MenuItem = {
      id: Date.now().toString(),
      name: newItem.name,
      description: newItem.description,
      price: Number(newItem.price),
      category: newItem.category,
      isAvailable: newItem.isAvailable ?? true,
      imageUrl: newItem.imageUrl ?? null,
    };

    setMenuItems([...menuItems, newMenuItem]);
    setNewItem({
      name: '',
      description: '',
      price: 0,
      category: '',
      isAvailable: true,
      imageUrl: null,
    });
    setIsAddDialogOpen(false);
    toast.success('Menu item added successfully!');
  };

  const handleEditItem = () => {
    if (!editingItem) {
      return;
    }

    // Mock: Update item in local state
    setMenuItems(menuItems.map(item =>
      item.id === editingItem.id ? { ...editingItem, price: Number(editingItem.price) } : item
    ));
    setEditingItem(null);
    setIsEditDialogOpen(false);
    toast.success('Menu item updated successfully!');
  };

  const handleDeleteItem = (id: string) => {
    // Mock: Remove item from local state
    setMenuItems(menuItems.filter(item => item.id !== id));
    toast.success('Menu item deleted successfully!');
  };

  const confirmDeleteItem = () => {
    if (!pendingDeleteId) {
      return;
    }

    handleDeleteItem(pendingDeleteId);
    setPendingDeleteId(null);
  };

  const toggleAvailability = (item: MenuItem) => {
    if (editingItem && editingItem.id === item.id) {
      setEditingItem({
        ...editingItem,
        isAvailable: !editingItem.isAvailable,
      });
    }

    // Mock: Update item availability in local state
    setMenuItems(menuItems.map(menuItem =>
      menuItem.id === item.id ? { ...menuItem, isAvailable: !menuItem.isAvailable } : menuItem
    ));
    toast.success('Availability updated');
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
      {/* 顶部标题 + 操作按钮（新增分类已加入） */}
      <div className="flex justify-between items-center">
        <div>
          <h2>Menu Management</h2>
          <p className="text-muted-foreground">Manage your restaurant's menu items and categories</p>
        </div>

        <div className="flex gap-2">
          {/* Add Menu Item */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Menu Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Add New Menu Item</DialogTitle>
                <DialogDescription>Fill in the details for your new menu item</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                        placeholder="12.99"
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
                      value={newItem.imageUrl ?? undefined}
                      onChange={(value) => setNewItem({...newItem, imageUrl: value ?? null})}
                      label="Item Image"
                    />
                  </div>
                </div>
                
                <Button onClick={handleAddItem} className="w-full" disabled={isMenuSaving}>
                  Add Item
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Add Category */}
          <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>Enter the name of your new category</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newCategory">Category Name</Label>
                  <Input
                    id="newCategory"
                    placeholder="e.g. Soups"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddCategory();
                    }}
                  />
                </div>
                <Button onClick={handleAddCategory} className="w-full">
                  Add
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
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
                ? filteredItems.filter((item) => item.isAvailable).length
                : menuItems.filter((item) => item.isAvailable).length}
            </div>
            {hasActiveFilters && (
              <p className="text-xs text-muted-foreground">
                ({menuItems.filter((item) => item.isAvailable).length} total)
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
                ? filteredItems.filter((item) => !item.isAvailable).length
                : menuItems.filter((item) => !item.isAvailable).length}
            </div>
            {hasActiveFilters && (
              <p className="text-xs text-muted-foreground">
                ({menuItems.filter((item) => !item.isAvailable).length} total)
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
              <p className="text-xs text-muted-foreground">({categories.length} total)</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Menu Items by Category */}
      {Object.keys(itemsByCategory).length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Filter className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg">No items found</h3>
            <p className="mb-4 text-center text-muted-foreground">
              {hasActiveFilters
                ? 'No menu items match your current filters. Try adjusting your search criteria.'
                : 'No menu items available. Add your first menu item to get started.'}
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
          <Card key={category} className="w-full">
            <CardHeader>
              <CardTitle>{category}</CardTitle>
              <CardDescription>{items.length} item(s)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-muted">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4>{item.name}</h4>
                          <Badge variant={item.isAvailable ? 'secondary' : 'destructive'}>
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
                        onCheckedChange={() => toggleAvailability(item)}
                        disabled={isMenuSaving}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingItem({ ...item });
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setPendingDeleteId(item.id)}
                        disabled={isMenuSaving}
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
                    value={editingItem.imageUrl ?? undefined}
                    onChange={(value) => setEditingItem({...editingItem, imageUrl: value ?? null})}
                    label="Item Image"
                  />
                </div>
              </div>
              
              <Button onClick={handleEditItem} className="w-full" disabled={isMenuSaving}>
                Update Item
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(pendingDeleteId)} onOpenChange={(open) => !open && setPendingDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete menu item?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The selected menu item will be removed from your menu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingDeleteId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteItem} disabled={isMenuSaving}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}