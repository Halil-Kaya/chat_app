const MessageManager = require('./utils/message-manager')

const messageManager = new MessageManager()

messageManager.addMessage('DCQSA!23sZ_$_FVFADCDA','FVFADCDA','Hello')
messageManager.addMessage('FVFADCDA_$_DCQSA!23sZ','FVFADCDA','2')
messageManager.addMessage('DCQSA!23sZ_$_FVFADCDA','FVFADCDA','3')
messageManager.addMessage('DCQSA!23sZ_$_FVFADCDA','FVFADCDA','4')
messageManager.addMessage('kaybedenler','FVFADCDA','5')

let data = messageManager.getMessages('FVFADCDA_$_DCQSA!23sZ')

console.log(data)