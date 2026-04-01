import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
})

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
})

export const productSchema = z.object({
  marca: z.string().min(1, 'La marca es obligatoria'),
  modelo: z.string().min(1, 'El modelo es obligatorio'),
  precio: z.coerce.number().positive('El precio es obligatorio y debe ser positivo'),
  tipo: z.enum(['SOL', 'VISTA']),
  formaGafa: z.enum([
    'RECTANGULAR', 'REDONDA', 'CUADRADA', 'OVALADA', 'AVIADOR',
    'POLIGONAL', 'MARIPOSA', 'OJOS_DE_GATO', 'CORAZON', 'BROWLINE',
  ]),
  formasCaraIdeal: z.array(
    z.enum(['OVALADA', 'CUADRADA', 'REDONDA', 'CORAZON', 'DIAMANTE'])
  ).min(1, 'Selecciona al menos una forma de cara compatible'),
  descripcion: z.string().optional(),
  imagenes: z.array(
    z.object({
      url: z.string().url('URL de imagen inválida'),
      esPrincipal: z.boolean().default(false),
    })
  ).min(1, 'Se requiere al menos una imagen'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ProductInput = z.infer<typeof productSchema>
