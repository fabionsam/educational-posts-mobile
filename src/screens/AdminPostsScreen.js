import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { theme } from '../styles/theme';

export default function AdminPostsScreen({ navigation }) {
  const { user, isAdmin } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts');
      setPosts(response.data);
    } catch (err) {
      console.warn('Erro ao carregar posts:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  const performDelete = async (postId) => {
    try {
      await api.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      Alert.alert('Sucesso', 'Postagem excluída.');
    } catch (err) {
      Alert.alert('Erro', err.response?.data?.error || 'Erro ao excluir.');
    }
  };

  const handleDelete = (postId, postTitle) => {
    if (Platform.OS === 'web') {
      const confirmed = typeof window !== 'undefined' ? window.confirm(`Deseja realmente excluir a postagem "${postTitle}"?`) : true;
      if (confirmed) {
        performDelete(postId);
      }
      return;
    }

    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente excluir a postagem "${postTitle}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => performDelete(postId),
        },
      ]
    );
  };

  // Filtragem: Professores veem apenas as suas postagens. Administrador vê todas.
  const displayedPosts = isAdmin
    ? posts
    : posts.filter((p) => user && (p.userId === user.id || p.author === user.name));

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.cardAuthor}>Autor: {item.author || 'Docente'}</Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.iconBtn, styles.viewBtn]}
          onPress={() => navigation.navigate('PostDetail', { id: item.id })}
        >
          <Ionicons name="eye-outline" size={18} color={theme.colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconBtn, styles.editBtn]}
          onPress={() => navigation.navigate('EditPost', { id: item.id })}
        >
          <Ionicons name="pencil-outline" size={18} color={theme.colors.warning} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconBtn, styles.deleteBtn]}
          onPress={() => handleDelete(item.id, item.title)}
        >
          <Ionicons name="trash-outline" size={18} color={theme.colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>
            {isAdmin ? 'Gestão Geral de Posts' : 'Minhas Postagens'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {isAdmin ? 'Todos os posts do sistema' : `Logado como: ${user?.name}`}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => navigation.navigate('CreatePost')}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.createBtnText}>Novo Post</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : displayedPosts.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="document-text-outline" size={48} color={theme.colors.textMuted} />
          <Text style={styles.emptyText}>Nenhuma postagem cadastrada.</Text>
        </View>
      ) : (
        <FlatList
          data={displayedPosts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.md,
    gap: 4,
  },
  createBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardInfo: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  cardAuthor: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  iconBtn: {
    padding: 8,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
  },
  viewBtn: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: 'transparent',
  },
  editBtn: {
    backgroundColor: theme.colors.warningLight,
    borderColor: 'transparent',
  },
  deleteBtn: {
    backgroundColor: theme.colors.dangerLight,
    borderColor: 'transparent',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
});
