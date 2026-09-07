import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Settings</h1>
        <p className="text-sm text-slate-500">Manage system-wide library preferences</p>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-w-lg">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Library Name</label>
            <Input defaultValue="CloudLib" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Support Email</label>
            <Input defaultValue="support@cloudlib.app" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Default Borrow Period (days)</label>
            <Input type="number" defaultValue={14} />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
