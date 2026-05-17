import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { 
  ShieldCheck, 
  Lock, 
  Coins, 
  Users, 
  Zap, 
  X, 
  ArrowRight,
  TrendingUp,
  CircleDot
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function TrustBlueprintModal({ visible, onClose }) {
  const [activeTab, setActiveTab] = useState('trust'); // 'trust' | 'clutter' | 'group'

  const tabs = [
    { id: 'trust', label: 'AI Trust Lock', icon: ShieldCheck },
    { id: 'clutter', label: 'INR Escrow', icon: Coins },
    { id: 'group', label: 'Co-Op Splits', icon: Users },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>AgriConnect Trust Blueprint</Text>
              <Text style={styles.headerSub}>Interactive Protocol Architecture</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X color="#64748b" size={20} />
            </TouchableOpacity>
          </View>

          {/* Tabs row */}
          <View style={styles.tabsRow}>
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id)}
                  style={[styles.tabBtn, isActive && styles.tabBtnActive]}
                >
                  <tab.icon color={isActive ? '#ffffff' : '#64748b'} size={16} />
                  <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Content */}
          <ScrollView showsVerticalScrollIndicator={false} style={styles.contentScroll}>
            {activeTab === 'trust' && (
              <View style={styles.tabContent}>
                <View style={styles.accentBadge}>
                  <Lock color="#059669" size={14} />
                  <Text style={styles.accentBadgeText}>Immutable Cargo Guarantee</Text>
                </View>
                
                <Text style={styles.bodyTitle}>Gasless Blockchain Quality Lock</Text>
                <Text style={styles.bodyDesc}>
                  To prevent cargo manipulation during transit, the holographic AI Quality Scan signs a cryptographic hash immediately upon grain analysis:
                </Text>

                {/* Flow Diagram */}
                <View style={styles.diagramContainer}>
                  <View style={styles.diagNode}>
                    <Text style={styles.diagNodeLabel}>AI Viewfinder Scan</Text>
                    <Text style={styles.diagNodeSub}>Grade A++ Confirmed</Text>
                  </View>
                  <ArrowRight color="#10b981" size={16} />
                  <View style={styles.diagNodeHighlight}>
                    <Text style={styles.diagNodeLabelLight}>On-Chain Hash Signed</Text>
                    <Text style={styles.diagNodeSubLight}>0x8f2d...c34b</Text>
                  </View>
                  <ArrowRight color="#10b981" size={16} />
                  <View style={styles.diagNode}>
                    <Text style={styles.diagNodeLabel}>Buyer Escrow Unlock</Text>
                    <Text style={styles.diagNodeSub}>Custody Match</Text>
                  </View>
                </View>

                <View style={styles.infoAlert}>
                  <CircleDot color="#059669" size={14} className="mt-0.5" />
                  <Text style={styles.infoAlertText}>
                    By locking crop specs prior to pickup, transporters cannot swap cargo with lower-grade produce during haulage. Escrow funds will automatically lock if specs don't match at destination.
                  </Text>
                </View>
              </View>
            )}

            {activeTab === 'clutter' && (
              <View style={styles.tabContent}>
                <View style={[styles.accentBadge, { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }]}>
                  <Zap color="#3b82f6" size={14} />
                  <Text style={[styles.accentBadgeText, { color: '#1e40af' }]}>Gasless Relayer Custody</Text>
                </View>
                
                <Text style={styles.bodyTitle}>Eliminating Blockchain Complexity</Text>
                <Text style={styles.bodyDesc}>
                  Agri-merchants and rural farmers care about traditional rupees, not volatile crypto assets. We sponsor all gas fees and handle smart contracts under-the-hood:
                </Text>

                {/* Comparison Row */}
                <View style={styles.comparisonRow}>
                  <View style={styles.compBox}>
                    <Text style={styles.compTitle}>Crypto Clutter (Hidden)</Text>
                    <Text style={styles.compValue}>Polygon Gas Fee Sponsor</Text>
                    <Text style={styles.compSub}>Escrow Multisig Deployer</Text>
                    <Text style={styles.compSub}>Stablecoin Liquid Relayer</Text>
                  </View>
                  <View style={[styles.compBox, { borderColor: '#3b82f6', backgroundColor: '#eff6ff/10' }]}>
                    <Text style={[styles.compTitle, { color: '#3b82f6' }]}>Pure INR View (Active)</Text>
                    <Text style={styles.compValue}>Standard Rupees (₹)</Text>
                    <Text style={styles.compSub}>Direct Bank/NPCI Transfer</Text>
                    <Text style={styles.compSub}>Instant Escrow Status</Text>
                  </View>
                </View>

                <View style={[styles.infoAlert, { backgroundColor: '#eff6ff', borderColor: '#dbeafe' }]}>
                  <CircleDot color="#3b82f6" size={14} className="mt-0.5" />
                  <Text style={[styles.infoAlertText, { color: '#1e40af' }]}>
                    Gas relayer sponsorships handle Polygon Amoy deployment, gas fee payments, and escrow contracts. End-users see only pure INR (₹) and standard bank transfer messages.
                  </Text>
                </View>
              </View>
            )}

            {activeTab === 'group' && (
              <View style={styles.tabContent}>
                <View style={[styles.accentBadge, { backgroundColor: '#faf5ff', borderColor: '#e9d5ff' }]}>
                  <Users color="#a855f7" size={14} />
                  <Text style={[styles.accentBadgeText, { color: '#6b21a8' }]}>Equal-Share Co-Operative</Text>
                </View>
                
                <Text style={styles.bodyTitle}>Equitable 4-Split Sourcing Pools</Text>
                <Text style={styles.bodyDesc}>
                  Empowers small-scale local buyers to combine purchasing power and co-fund high-density wholesale logistics shipments:
                </Text>

                {/* Sourcing pool visual splits */}
                <View style={styles.poolSplitCard}>
                  <View style={styles.poolSplitHeader}>
                    <Text style={styles.poolSplitTitle}>Active Sourcing Pool Split</Text>
                    <Text style={styles.poolSplitValue}>4 Members Max</Text>
                  </View>
                  
                  <View style={styles.splitProgressRow}>
                    <View style={[styles.splitBar, { backgroundColor: '#a855f7' }]}><Text style={styles.splitBarText}>25%</Text></View>
                    <View style={[styles.splitBar, { backgroundColor: '#a855f7' }]}><Text style={styles.splitBarText}>25%</Text></View>
                    <View style={[styles.splitBar, { backgroundColor: '#a855f7' }]}><Text style={styles.splitBarText}>25%</Text></View>
                    <View style={[styles.splitBar, { backgroundColor: '#e9d5ff' }]}><Text style={[styles.splitBarText, { color: '#6b21a8' }]}>25%</Text></View>
                  </View>

                  <View style={styles.poolStatusFooter}>
                    <Text style={styles.poolStatusText}>3 of 4 Committed (75%)</Text>
                    <Text style={styles.poolStatusAction}>Awaiting Final Buyer</Text>
                  </View>
                </View>

                <View style={[styles.infoAlert, { backgroundColor: '#faf5ff', borderColor: '#f3e8ff' }]}>
                  <CircleDot color="#a855f7" size={14} className="mt-0.5" />
                  <Text style={[styles.infoAlertText, { color: '#6b21a8' }]}>
                    Splitting purchase cost and transporter mileage equally among 4 participants eliminates the high capital barriers, allowing small retailers to easily bypass major corporate wholesalers.
                  </Text>
                </View>
              </View>
            )}

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'end',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0f172a',
  },
  headerSub: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tabBtnActive: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  contentScroll: {
    flexGrow: 0,
  },
  tabContent: {
    flex: 1,
  },
  accentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  accentBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#047857',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bodyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
  },
  bodyDesc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 20,
    fontWeight: '500',
    marginBottom: 20,
  },
  diagramContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 20,
    padding: 14,
    marginBottom: 20,
  },
  diagNode: {
    width: '28%',
    alignItems: 'center',
  },
  diagNodeHighlight: {
    width: '32%',
    alignItems: 'center',
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  diagNodeLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
  },
  diagNodeLabelLight: {
    fontSize: 9,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
  },
  diagNodeSub: {
    fontSize: 8,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  diagNodeSubLight: {
    fontSize: 7,
    color: '#d1fae5',
    fontWeight: '800',
    marginTop: 2,
    textAlign: 'center',
  },
  infoAlert: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#d1fae5',
    borderRadius: 16,
    padding: 12,
  },
  infoAlertText: {
    flex: 1,
    fontSize: 11,
    color: '#065f46',
    fontWeight: '650',
    lineHeight: 18,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  compBox: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 20,
    padding: 14,
    backgroundColor: '#f8fafc',
  },
  compTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  compValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
  },
  compSub: {
    fontSize: 9,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 4,
  },
  poolSplitCard: {
    backgroundColor: '#fdf8ff',
    borderWidth: 1,
    borderColor: '#f3e8ff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
  },
  poolSplitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  poolSplitTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
  },
  poolSplitValue: {
    fontSize: 10,
    fontWeight: '900',
    color: '#a855f7',
    backgroundColor: '#faf5ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e9d5ff',
  },
  splitProgressRow: {
    flexDirection: 'row',
    height: 24,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 14,
    gap: 2,
  },
  splitBar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splitBarText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#ffffff',
  },
  poolStatusFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  poolStatusText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0f172a',
  },
  poolStatusAction: {
    fontSize: 10,
    fontWeight: '900',
    color: '#a855f7',
  },
});
