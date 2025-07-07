import { 
  Container, 
  Title, 
  Text, 
  Stack, 
  Paper,
  Group,
  Button,
  Badge,
  Grid,
  Card,
  Divider,
} from '@mantine/core';
import { IconTargetArrow, IconPlus, IconFilter, IconFileText } from '@tabler/icons-react';
import { useActiveNavItem } from '../stores/layoutStore';
import { useEffect } from 'react';

export const CriteriaPage: React.FC = () => {
  const { setActiveItem } = useActiveNavItem();

  useEffect(() => {
    setActiveItem('criteria');
  }, [setActiveItem]);

  return (
    <Container size="xl">
      <Stack gap="xl">
        {/* Page Header */}
        <Group justify="space-between" align="center">
          <Stack gap="xs">
            <Group gap="sm">
              <IconTargetArrow size={32} color="var(--mantine-color-blue-6)" />
              <Title order={1}>Criteria Management</Title>
            </Group>
            <Text c="dimmed" size="lg">
              Define and manage your opportunity matching criteria
            </Text>
          </Stack>
          <Button leftSection={<IconPlus size={18} />} size="md">
            New Criteria
          </Button>
        </Group>

        {/* Quick Stats */}
        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Paper p="md" radius="md" style={{ border: '1px solid var(--mantine-color-default-border)' }}>
              <Stack gap="xs">
                <Text size="sm" c="dimmed" fw={500}>Active Criteria</Text>
                <Text size="xl" fw={700} c="blue">12</Text>
                <Text size="xs" c="green">↑ 2 this month</Text>
              </Stack>
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Paper p="md" radius="md" style={{ border: '1px solid var(--mantine-color-default-border)' }}>
              <Stack gap="xs">
                <Text size="sm" c="dimmed" fw={500}>Matches Today</Text>
                <Text size="xl" fw={700} c="blue">8</Text>
                <Text size="xs" c="green">↑ 15% vs yesterday</Text>
              </Stack>
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Paper p="md" radius="md" style={{ border: '1px solid var(--mantine-color-default-border)' }}>
              <Stack gap="xs">
                <Text size="sm" c="dimmed" fw={500}>Success Rate</Text>
                <Text size="xl" fw={700} c="blue">78%</Text>
                <Text size="xs" c="green">↑ 5% this week</Text>
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>

        {/* Quick Actions */}
        <Paper p="xl" radius="md" style={{ border: '1px solid var(--mantine-color-default-border)' }}>
          <Stack gap="md">
            <Title order={3}>Quick Actions</Title>
            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card padding="lg" radius="md" style={{ border: '1px solid var(--mantine-color-default-border)', height: '100%' }}>
                  <Stack gap="md">
                    <Group gap="sm">
                      <IconFilter size={24} color="var(--mantine-color-blue-6)" />
                      <Title order={4}>Manage Criteria</Title>
                    </Group>
                    <Text c="dimmed">
                      Create, edit, and organize your opportunity matching criteria
                    </Text>
                    <Button variant="light" fullWidth>
                      Manage Criteria
                    </Button>
                  </Stack>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card padding="lg" radius="md" style={{ border: '1px solid var(--mantine-color-default-border)', height: '100%' }}>
                  <Stack gap="md">
                    <Group gap="sm">
                      <IconFileText size={24} color="var(--mantine-color-blue-6)" />
                      <Title order={4}>Templates</Title>
                    </Group>
                    <Text c="dimmed">
                      Use pre-built templates to quickly set up common criteria patterns
                    </Text>
                    <Button variant="light" fullWidth>
                      Browse Templates
                    </Button>
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Stack>
        </Paper>

        {/* Recent Criteria */}
        <Paper p="xl" radius="md" style={{ border: '1px solid var(--mantine-color-default-border)' }}>
          <Stack gap="md">
            <Group justify="space-between">
              <Title order={3}>Recent Criteria</Title>
              <Button variant="subtle" size="sm">View All</Button>
            </Group>
            <Divider />
            <Stack gap="md">
              {[
                { name: 'AI Research Grants', matches: 5, status: 'active' },
                { name: 'Small Business Funding', matches: 12, status: 'active' },
                { name: 'Technology Innovation', matches: 3, status: 'paused' },
              ].map((criteria, index) => (
                <Group key={index} justify="space-between" p="sm" style={{ 
                  borderRadius: 'var(--mantine-radius-sm)',
                  border: '1px solid var(--mantine-color-default-border)',
                }}>
                  <Group gap="md">
                    <Stack gap={0}>
                      <Text fw={500}>{criteria.name}</Text>
                      <Text size="sm" c="dimmed">{criteria.matches} matches this week</Text>
                    </Stack>
                  </Group>
                  <Group gap="sm">
                    <Badge 
                      color={criteria.status === 'active' ? 'green' : 'orange'}
                      variant="light"
                    >
                      {criteria.status}
                    </Badge>
                    <Button variant="subtle" size="xs">Edit</Button>
                  </Group>
                </Group>
              ))}
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default CriteriaPage; 