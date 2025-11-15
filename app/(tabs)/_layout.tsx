import React, { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import SideDrawer from '@/components/layout/SideDrawer';
import { colors } from '@/constants/colors';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialIcons>['name'];
  color: string;
}) {
  return <MaterialIcons size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleMenuPress = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  return (
    <>
      <SideDrawer isOpen={isDrawerOpen} onClose={handleDrawerClose} />
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary[500],
        tabBarStyle: { display: 'none' },
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerLeft: () => (
            <Pressable onPress={handleMenuPress}>
              {({ pressed }) => (
                <MaterialIcons
                  name="menu"
                  size={25}
                  color={colors.neutral.black}
                  style={{ marginLeft: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <MaterialIcons
                    name="info-outline"
                    size={25}
                    color={colors.neutral.black}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Tab Two',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
    </Tabs>
    </>
  );
}
