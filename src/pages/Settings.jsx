import PageContainer from '../components/layout/PageContainer.jsx';
import PageHeader from '../components/layout/PageHeader.jsx';
import Card from '../components/common/Card.jsx';
import Input from '../components/forms/Input.jsx';
import Button from '../components/common/Button.jsx';
import { Switch } from '../components/forms/Controls.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  const { theme, toggle } = useTheme();
  return (
    <PageContainer>
      <PageHeader title="Settings" subtitle="Console preferences." icon={<SettingsIcon size={18} />} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5 space-y-4">
          <h3 className="text-sm font-semibold text-fg">Appearance</h3>
          <Switch label="Dark mode" checked={theme === 'dark'} onChange={toggle} />
        </Card>
        <Card className="p-5 space-y-4">
          <h3 className="text-sm font-semibold text-fg">Workspace</h3>
          <Input label="Organization" defaultValue="BAIUST CSE" />
          <Input label="Support email" defaultValue="team@sunnologic.dev" />
          <Button>Save changes</Button>
        </Card>
      </div>
    </PageContainer>
  );
}
