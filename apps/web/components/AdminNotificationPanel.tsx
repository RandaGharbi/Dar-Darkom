'use client';

import React, { useState } from 'react';
import { Button } from './styled/Button';
import { Input, TextArea, Label } from './styled/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './styled/Card';
import { TabsProvider, TabsList, TabsTriggerComponent, TabsContentComponent } from './styled/Tabs';
import { Select, SelectItem } from './styled/Select';
import { Badge } from './styled/Badge';
import { Bell, Send, Users, Package, Truck, Gift } from 'lucide-react';
import notificationService from '@/services/notificationService';

interface NotificationData {
  userId?: string;
  type: 'order_update' | 'promotion' | 'delivery_update' | 'general' | 'system';
  title: string;
  message: string;
  data?: any;
}

interface OrderUpdateData {
  userId: string;
  orderId: string;
  status: string;
  message?: string;
}

interface DeliveryUpdateData {
  userId: string;
  orderId: string;
  driverName?: string;
  estimatedTime?: string;
  status?: string;
}

interface PromotionData {
  userIds?: string[];
  promotionId: string;
  title: string;
  message: string;
  data?: any;
}

export default function AdminNotificationPanel() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // États pour les différents types de notifications
  const [notificationData, setNotificationData] = useState<NotificationData>({
    type: 'general',
    title: '',
    message: '',
  });

  const [orderUpdateData, setOrderUpdateData] = useState<OrderUpdateData>({
    userId: '',
    orderId: '',
    status: 'confirmed',
    message: '',
  });

  const [deliveryUpdateData, setDeliveryUpdateData] = useState<DeliveryUpdateData>({
    userId: '',
    orderId: '',
    driverName: '',
    estimatedTime: '30 minutes',
    status: 'in_transit',
  });

  const [promotionData, setPromotionData] = useState<PromotionData>({
    promotionId: '',
    title: '',
    message: '',
  });

  // Fonction générique pour envoyer une requête
  const sendRequest = async (apiCall: () => Promise<any>) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await apiCall();

      if (result.success) {
        setSuccess('Notification envoyée avec succès !');
      } else {
        setError(result.error || 'Erreur lors de l\'envoi de la notification');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  // Envoyer une notification générale
  const handleSendNotification = () => {
    if (!notificationData.title || !notificationData.message) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    sendRequest(() => notificationService.sendNotification(notificationData));
  };

  // Envoyer une mise à jour de commande
  const handleSendOrderUpdate = () => {
    if (!orderUpdateData.userId || !orderUpdateData.orderId) {
      setError('Veuillez remplir l\'ID utilisateur et l\'ID de commande');
      return;
    }

    sendRequest(() => notificationService.sendOrderUpdate(orderUpdateData));
  };

  // Envoyer une mise à jour de livraison
  const handleSendDeliveryUpdate = () => {
    if (!deliveryUpdateData.userId || !deliveryUpdateData.orderId) {
      setError('Veuillez remplir l\'ID utilisateur et l\'ID de commande');
      return;
    }

    sendRequest(() => notificationService.sendDeliveryUpdate(deliveryUpdateData));
  };

  // Envoyer une promotion
  const handleSendPromotion = () => {
    if (!promotionData.promotionId || !promotionData.title || !promotionData.message) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    sendRequest(() => notificationService.sendPromotion(promotionData));
  };

  // Diffuser une notification à tous les utilisateurs
  const handleBroadcast = () => {
    if (!notificationData.title || !notificationData.message) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const { userId, ...broadcastData } = notificationData;
    sendRequest(() => notificationService.broadcastNotification(broadcastData));
  };

  return (
    <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <Bell size={24} color="#2E86AB" />
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', margin: 0 }}>
          Panneau de Notifications Admin
        </h1>
      </div>

      {success && (
        <div style={{ 
          background: '#d1fae5', 
          border: '1px solid #10b981', 
          color: '#065f46', 
          padding: '12px 16px', 
          borderRadius: '12px',
          marginBottom: '16px'
        }}>
          {success}
        </div>
      )}

      {error && (
        <div style={{ 
          background: '#fee2e2', 
          border: '1px solid #ef4444', 
          color: '#991b1b', 
          padding: '12px 16px', 
          borderRadius: '12px',
          marginBottom: '16px'
        }}>
          {error}
        </div>
      )}

      <TabsProvider defaultValue="general">
        <TabsList>
          <TabsTriggerComponent value="general">Général</TabsTriggerComponent>
          <TabsTriggerComponent value="orders">Commandes</TabsTriggerComponent>
          <TabsTriggerComponent value="delivery">Livraison</TabsTriggerComponent>
          <TabsTriggerComponent value="promotions">Promotions</TabsTriggerComponent>
        </TabsList>

        {/* Notifications générales */}
        <TabsContentComponent value="general">
          <Card>
            <CardHeader>
              <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={20} color="#2E86AB" />
                <span>Notification Générale</span>
              </CardTitle>
              <CardDescription>
                Envoyer une notification à un utilisateur spécifique ou à tous les utilisateurs
              </CardDescription>
            </CardHeader>
            <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <Label htmlFor="userId">ID Utilisateur (optionnel)</Label>
                  <Input
                    id="userId"
                    placeholder="Laissez vide pour diffuser à tous"
                    value={notificationData.userId || ''}
                    onChange={(e) => setNotificationData({ ...notificationData, userId: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type de notification</Label>
                  <Select
                    value={notificationData.type}
                    onValueChange={(value: any) => setNotificationData({ ...notificationData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">Général</SelectItem>
                      <SelectItem value="system">Système</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  placeholder="Titre de la notification"
                  value={notificationData.title}
                  onChange={(e) => setNotificationData({ ...notificationData, title: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Message de la notification"
                  value={notificationData.message}
                  onChange={(e) => setNotificationData({ ...notificationData, message: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleSendNotification} disabled={loading}>
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer
                </Button>
                <Button onClick={handleBroadcast} disabled={loading} variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Diffuser à tous
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContentComponent>

        {/* Mises à jour de commandes */}
        <TabsContentComponent value="orders">
          <Card>
            <CardHeader>
              <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={20} color="#2E86AB" />
                <span>Mise à jour de Commande</span>
              </CardTitle>
              <CardDescription>
                Notifier un utilisateur d'un changement de statut de commande
              </CardDescription>
            </CardHeader>
            <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <Label htmlFor="orderUserId">ID Utilisateur *</Label>
                  <Input
                    id="orderUserId"
                    placeholder="ID de l'utilisateur"
                    value={orderUpdateData.userId}
                    onChange={(e) => setOrderUpdateData({ ...orderUpdateData, userId: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="orderId">ID Commande *</Label>
                  <Input
                    id="orderId"
                    placeholder="ID de la commande"
                    value={orderUpdateData.orderId}
                    onChange={(e) => setOrderUpdateData({ ...orderUpdateData, orderId: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <Label htmlFor="status">Statut</Label>
                  <Select
                    value={orderUpdateData.status}
                    onValueChange={(value) => setOrderUpdateData({ ...orderUpdateData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirmed">Confirmée</SelectItem>
                      <SelectItem value="preparing">En préparation</SelectItem>
                      <SelectItem value="ready">Prête</SelectItem>
                      <SelectItem value="out_for_delivery">En cours de livraison</SelectItem>
                      <SelectItem value="delivered">Livrée</SelectItem>
                      <SelectItem value="cancelled">Annulée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="orderMessage">Message personnalisé</Label>
                  <Input
                    id="orderMessage"
                    placeholder="Message optionnel"
                    value={orderUpdateData.message || ''}
                    onChange={(e) => setOrderUpdateData({ ...orderUpdateData, message: e.target.value })}
                  />
                </div>
              </div>

              <Button onClick={handleSendOrderUpdate} disabled={loading}>
                <Send className="h-4 w-4 mr-2" />
                Envoyer la mise à jour
              </Button>
            </CardContent>
          </Card>
        </TabsContentComponent>

        {/* Mises à jour de livraison */}
        <TabsContentComponent value="delivery">
          <Card>
            <CardHeader>
              <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={20} color="#2E86AB" />
                <span>Mise à jour de Livraison</span>
              </CardTitle>
              <CardDescription>
                Notifier un utilisateur de l'état de sa livraison
              </CardDescription>
            </CardHeader>
            <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <Label htmlFor="deliveryUserId">ID Utilisateur *</Label>
                  <Input
                    id="deliveryUserId"
                    placeholder="ID de l'utilisateur"
                    value={deliveryUpdateData.userId}
                    onChange={(e) => setDeliveryUpdateData({ ...deliveryUpdateData, userId: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryOrderId">ID Commande *</Label>
                  <Input
                    id="deliveryOrderId"
                    placeholder="ID de la commande"
                    value={deliveryUpdateData.orderId}
                    onChange={(e) => setDeliveryUpdateData({ ...deliveryUpdateData, orderId: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="driverName">Nom du livreur</Label>
                  <Input
                    id="driverName"
                    placeholder="Nom du livreur"
                    value={deliveryUpdateData.driverName || ''}
                    onChange={(e) => setDeliveryUpdateData({ ...deliveryUpdateData, driverName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="estimatedTime">Temps estimé</Label>
                  <Input
                    id="estimatedTime"
                    placeholder="30 minutes"
                    value={deliveryUpdateData.estimatedTime || ''}
                    onChange={(e) => setDeliveryUpdateData({ ...deliveryUpdateData, estimatedTime: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryStatus">Statut</Label>
                  <Select
                    value={deliveryUpdateData.status || 'in_transit'}
                    onValueChange={(value) => setDeliveryUpdateData({ ...deliveryUpdateData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_transit">En transit</SelectItem>
                      <SelectItem value="arrived">Arrivé</SelectItem>
                      <SelectItem value="delivered">Livré</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleSendDeliveryUpdate} disabled={loading}>
                <Send className="h-4 w-4 mr-2" />
                Envoyer la mise à jour
              </Button>
            </CardContent>
          </Card>
        </TabsContentComponent>

        {/* Promotions */}
        <TabsContentComponent value="promotions">
          <Card>
            <CardHeader>
              <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Gift size={20} color="#2E86AB" />
                <span>Promotion</span>
              </CardTitle>
              <CardDescription>
                Envoyer une notification de promotion à des utilisateurs spécifiques ou à tous
              </CardDescription>
            </CardHeader>
            <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <Label htmlFor="promotionId">ID Promotion *</Label>
                  <Input
                    id="promotionId"
                    placeholder="ID de la promotion"
                    value={promotionData.promotionId}
                    onChange={(e) => setPromotionData({ ...promotionData, promotionId: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="userIds">IDs Utilisateurs (optionnel)</Label>
                  <Input
                    id="userIds"
                    placeholder="user1,user2,user3 (vide = tous)"
                    value={promotionData.userIds?.join(',') || ''}
                    onChange={(e) => setPromotionData({ 
                      ...promotionData, 
                      userIds: e.target.value ? e.target.value.split(',').map(id => id.trim()) : undefined 
                    })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="promotionTitle">Titre *</Label>
                <Input
                  id="promotionTitle"
                  placeholder="Titre de la promotion"
                  value={promotionData.title}
                  onChange={(e) => setPromotionData({ ...promotionData, title: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="promotionMessage">Message *</Label>
                <Textarea
                  id="promotionMessage"
                  placeholder="Description de la promotion"
                  value={promotionData.message}
                  onChange={(e) => setPromotionData({ ...promotionData, message: e.target.value })}
                  rows={3}
                />
              </div>

              <Button onClick={handleSendPromotion} disabled={loading}>
                <Send className="h-4 w-4 mr-2" />
                Envoyer la promotion
              </Button>
            </CardContent>
          </Card>
        </TabsContentComponent>
      </TabsProvider>
    </div>
  );
}
