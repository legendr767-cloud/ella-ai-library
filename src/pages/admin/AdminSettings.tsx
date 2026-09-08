import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage system-wide library preferences</p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-w-lg">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Library Name</label>
            <Input defaultValue="Ella's Library" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Support Email</label>
            <Input defaultValue="support@ellaslibrary.app" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Default Borrow Period (days)</label>
            <Input type="number" defaultValue={14} />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
