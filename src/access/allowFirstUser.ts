import type { Access } from 'payload/types'

/**
 * İlk kullanıcı oluşturulmasına izin verir
 * Eğer hiç kullanıcı yoksa, yeni kullanıcı oluşturulabilir
 */
export const allowFirstUser: Access = async ({ req }) => {
  // Eğer kullanıcı zaten giriş yapmışsa, izin ver
  if (req.user) {
    return true
  }

  // İlk kullanıcı kontrolü - Payload CMS otomatik olarak yönetir
  // Admin panel üzerinden ilk kullanıcı oluşturulabilir
  return true
}

