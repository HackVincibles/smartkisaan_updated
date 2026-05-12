const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
    eventType: { type: String, default: 'SYSTEM_ACTION' },
    
    // Human readable action
    action: { type: String, required: true }, 
    
    // Who did it
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    // What was affected (optional)
    targetId: { type: mongoose.Schema.Types.ObjectId, default: null },
    
    // Human readable details
    details: { type: String, default: null },

    // Blockchain tracking (optional)
    blockchainTx: { type: String, default: 'mock_stub' },
    explorerUrl: { type: String, default: null },

    // Metadata snapshot
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

auditLogSchema.index({ eventType: 1, action: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
