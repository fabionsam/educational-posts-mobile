import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { theme } from '../styles/theme';

// Screens
import HomeScreen from '../screens/HomeScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import LoginScreen from '../screens/LoginScreen';
import AdminPostsScreen from '../screens/AdminPostsScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import EditPostScreen from '../screens/EditPostScreen';
import TeachersListScreen from '../screens/TeachersListScreen';
import CreateTeacherScreen from '../screens/CreateTeacherScreen';
import EditTeacherScreen from '../screens/EditTeacherScreen';
import StudentsListScreen from '../screens/StudentsListScreen';
import CreateStudentScreen from '../screens/CreateStudentScreen';
import EditStudentScreen from '../screens/EditStudentScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const defaultScreenOptions = {
  headerStyle: {
    backgroundColor: '#ffffff',
  },
  headerTintColor: theme.colors.primary,
  headerTitleStyle: {
    fontWeight: '700',
    fontSize: 18,
    color: theme.colors.textDark,
  },
  headerShadowVisible: true,
};

// 1. Feed Stack
function FeedNavigator() {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="FeedHome"
        component={HomeScreen}
        options={{ title: 'EduBlog Mobile' }}
      />
      <Stack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{ title: 'Leitura da Postagem' }}
      />
      <Stack.Screen
        name="EditPost"
        component={EditPostScreen}
        options={{ title: 'Editar Post' }}
      />
    </Stack.Navigator>
  );
}

// 2. Admin Posts Stack
function AdminPostsNavigator() {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="AdminPostsList"
        component={AdminPostsScreen}
        options={{ title: 'Painel de Posts' }}
      />
      <Stack.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{ title: 'Criar Postagem' }}
      />
      <Stack.Screen
        name="EditPost"
        component={EditPostScreen}
        options={{ title: 'Editar Postagem' }}
      />
      <Stack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{ title: 'Visualizar Post' }}
      />
    </Stack.Navigator>
  );
}

// 3. Teachers Stack
function TeachersNavigator() {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="TeachersList"
        component={TeachersListScreen}
        options={{ title: 'Docentes' }}
      />
      <Stack.Screen
        name="CreateTeacher"
        component={CreateTeacherScreen}
        options={{ title: 'Novo Docente' }}
      />
      <Stack.Screen
        name="EditTeacher"
        component={EditTeacherScreen}
        options={{ title: 'Editar Docente' }}
      />
    </Stack.Navigator>
  );
}

// 4. Students Stack
function StudentsNavigator() {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="StudentsList"
        component={StudentsListScreen}
        options={{ title: 'Alunos' }}
      />
      <Stack.Screen
        name="CreateStudent"
        component={CreateStudentScreen}
        options={{ title: 'Novo Aluno' }}
      />
      <Stack.Screen
        name="EditStudent"
        component={EditStudentScreen}
        options={{ title: 'Editar Aluno' }}
      />
    </Stack.Navigator>
  );
}

// 5. Profile / Auth Stack
function ProfileNavigator() {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ title: 'Perfil & Configuração' }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Entrar na Conta' }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { isTeacher, isAdmin, isAuthenticated } = useAuth();
  const canManage = isTeacher || isAdmin;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="FeedTab"
        component={FeedNavigator}
        options={{
          tabBarLabel: 'Feed',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper-outline" size={size} color={color} />
          ),
        }}
      />

      {canManage && (
        <Tab.Screen
          name="AdminPostsTab"
          component={AdminPostsNavigator}
          options={{
            tabBarLabel: 'Postagens',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="document-text-outline" size={size} color={color} />
            ),
          }}
        />
      )}

      {canManage && (
        <Tab.Screen
          name="TeachersTab"
          component={TeachersNavigator}
          options={{
            tabBarLabel: 'Docentes',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people-outline" size={size} color={color} />
            ),
          }}
        />
      )}

      {canManage && (
        <Tab.Screen
          name="StudentsTab"
          component={StudentsNavigator}
          options={{
            tabBarLabel: 'Alunos',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="school-outline" size={size} color={color} />
            ),
          }}
        />
      )}

      <Tab.Screen
        name="ProfileTab"
        component={ProfileNavigator}
        options={{
          tabBarLabel: isAuthenticated ? 'Perfil' : 'Entrar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name={isAuthenticated ? 'person-circle-outline' : 'log-in-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
