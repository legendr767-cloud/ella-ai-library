import { useState, useEffect } from 'react';
import { User, Lock, Bell, Globe, Palette, Save, Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/store/authStore';

export default function ProfilePage() {
  const { profile: authProfile, user, updateProfile } = useAuthStore();

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
    student_id: '',
    department: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    borrowReminders: true,
    recommendations: true,
    newsletter: false,
  });

  useEffect(() => {
    if (authProfile) {
      setFormData({
        full_name: authProfile.full_name || '',
        phone: authProfile.phone || '',
        address: authProfile.address || '',
        student_id: authProfile.student_id || '',
        department: authProfile.department || '',
      });
    }
  }, [authProfile]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError('');
    try {
      await updateProfile(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setSaveError(err?.message || 'Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recently';

  const initials = formData.full_name
    ? formData.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Profile Picture */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Update your profile photo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                {initials}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h3 className="font-semibold text-lg">{formData.full_name || 'No name set'}</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <div className="flex gap-2 mt-2">
                <Badge>Member since {memberSince}</Badge>
                <Badge variant="outline">{authProfile?.total_books_read ?? 0} Books Read</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={user?.email || ''}
                disabled
                className="opacity-60 cursor-not-allowed"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Student ID</label>
            <Input
              placeholder="e.g. STU-2024-001"
              value={formData.student_id}
              onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Department</label>
            <Input
              placeholder="e.g. Computer Science"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone</label>
            <Input
              placeholder="e.g. +1 234 567 8900"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Address</label>
            <Input
              placeholder="Your address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Reading Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Reading Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Favorite Genres</label>
            <div className="flex flex-wrap gap-2">
              {profile.favoriteGenres.map((genre) => (
                <Badge key={genre} variant="default">
                  {genre}
                  <button className="ml-2 hover:text-red-500">×</button>
                </Badge>
              ))}
              <Button variant="outline" size="sm">+ Add Genre</Button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Reading Goal (per year)</label>
              <Input type="number" defaultValue="50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Preferred Format</label>
              <select className="w-full px-3 py-2 rounded-md border bg-background">
                <option>E-Book</option>
                <option>Physical</option>
                <option>Audiobook</option>
                <option>Any</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(preferences).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="text-sm text-muted-foreground">
                  {key === 'emailNotifications' && 'Receive email updates about your account'}
                  {key === 'borrowReminders' && 'Get reminded about due dates'}
                  {key === 'recommendations' && 'Receive personalized book recommendations'}
                  {key === 'newsletter' && 'Subscribe to our monthly newsletter'}
                </p>
              </div>
              <button
                onClick={() => setPreferences({ ...preferences, [key]: !value })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start gap-2">
            <Lock className="w-4 h-4" />
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2">
            <Globe className="w-4 h-4" />
            Two-Factor Authentication
          </Button>
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-2">Account Actions</p>
            <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      {saveError && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {saveError}
        </div>
      )}
      {saveSuccess && (
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-sm text-green-400">
          Profile saved successfully!
        </div>
      )}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => {
          if (authProfile) {
            setFormData({
              full_name: authProfile.full_name || '',
              phone: authProfile.phone || '',
              address: authProfile.address || '',
              student_id: authProfile.student_id || '',
              department: authProfile.department || '',
            });
          }
        }}>Cancel</Button>
        <Button className="gap-2" onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</>
          ) : (
            <><Save className="w-4 h-4" />Save Changes</>
          )}
        </Button>
      </div>
    </div>
  );
}
