/**
 * Spanish UI copy (single locale). Import `ui` in components and API fallbacks.
 */
import type { InvoiceStatus } from "@/lib/types/invoice";

export const ui = {
  meta: {
    title: "Club Floor — Gestión de local",
    description:
      "Operaciones de discoteca: personal, servicios (puntos) y consumos en barra.",
  },

  home: {
    tagline: "Operaciones del local",
    description:
      "Consola de gestión para discotecas: controla lo que ofrece tu equipo y lo que circula por la barra.",
    signIn: "Entrar",
    register: "Registrarse",
  },

  nav: {
    brand: "FLOOR",
    controlRoom: "Sala de control",
    roster: "Plantilla",
    catalog: "Catálogo",
    tabs: "Cuentas",
    home: "Inicio",
  },

  login: {
    title: "ENTRAR",
    subtitle: "Gestión nocturna — acceso del personal",
    email: "Correo",
    password: "Contraseña",
    submit: "Iniciar sesión",
    submitting: "Entrando…",
    footer: "¿Local nuevo?",
    createAccount: "Crear cuenta",
    genericError: "Algo salió mal. Inténtalo de nuevo.",
  },

  signup: {
    title: "UNIRSE",
    subtitle: "Registra el espacio de trabajo de tu club",
    email: "Correo",
    password: "Contraseña",
    confirmPassword: "Confirmar contraseña",
    submit: "Crear cuenta",
    submitting: "Creando…",
    footer: "¿Ya tienes cuenta?",
    signIn: "Iniciar sesión",
    genericError: "Algo salió mal. Inténtalo de nuevo.",
  },

  dashboard: {
    kicker: "CONTROL",
    title: "Sala de control",
    signOut: "Cerrar sesión",
    signingOut: "Cerrando sesión…",
    profileError:
      "No se pudo actualizar tu perfil. Puedes seguir usando la app o reintentar más tarde.",
    intro:
      "Gestiona la plantilla del local, los servicios (puntos) y los productos de barra desde aquí. Empieza por la plantilla: cada ficha es un perfil de pista con el que podrás facturar.",
    openRoster: "Abrir plantilla",
    openCatalog: "Catálogo de barra",
    floorTabs: "Cuentas de pista",
  },

  apartments: {
    listKicker: "Plantilla de pista",
    listTitle: "Fichas",
    listIntro:
      "Crea y mantén las fichas de la plantilla. Cada una podrá vincularse a cuentas y consumos más adelante.",
    addProfile: "Añadir ficha",
    loadError: "No se pudo cargar la plantilla.",
    empty: "Aún no hay fichas.",
    addFirst: "Añadir la primera ficha",
    editLink: "Editar →",
    backToRoster: "← Volver a la plantilla",
    backToRosterPlain: "Volver a la plantilla",
    newKicker: "Nueva ficha",
    newTitle: "Añadir ficha",
    editKicker: "Editar ficha",
    saving: "Guardando…",
    createSubmit: "Crear ficha",
    saveChanges: "Guardar cambios",
    invalidLink: "Enlace de ficha no válido.",
    loadProfileError: "No se pudo cargar la ficha.",
    createError: "No se pudo crear la ficha.",
    updateError: "No se pudo actualizar la ficha.",
    deleteError: "No se pudo eliminar la ficha.",
    confirmDelete:
      "¿Quitar esta ficha de la plantilla? Esta acción no se puede deshacer.",
    removing: "Eliminando…",
    removeFromRoster: "Quitar de la plantilla",
    apartmentForm: {
      displayName: "Nombre visible",
      email: "Correo",
      phone: "Teléfono",
      phoneOptional: "(opcional)",
      submitCreate: "Crear ficha",
      submitSaving: "Guardando…",
    },
  },

  products: {
    listKicker: "Barra",
    listTitle: "Productos",
    listIntro:
      "Artículos del catálogo con SKU, precio y existencias. Se usan al añadir líneas de producto en las cuentas.",
    addProduct: "Añadir producto",
    loadError: "No se pudo cargar el catálogo.",
    empty: "Aún no hay productos.",
    addFirst: "Añadir el primero",
    editLink: "Editar →",
    backToList: "← Volver al catálogo",
    backToListPlain: "Volver al catálogo",
    newKicker: "Nuevo artículo",
    newTitle: "Añadir producto",
    editKicker: "Editar producto",
    saving: "Guardando…",
    createSubmit: "Crear producto",
    saveChanges: "Guardar cambios",
    invalidLink: "Enlace de producto no válido.",
    loadProductError: "No se pudo cargar el producto.",
    confirmDelete:
      "¿Eliminar este producto? También se quitarán las líneas de factura que lo referencien.",
    removing: "Eliminando…",
    deleteProduct: "Eliminar producto",
    stockUnits: "uds.",
    productForm: {
      name: "Nombre",
      sku: "SKU",
      price: "Precio",
      stock: "Existencias",
    },
  },

  invoices: {
    listKicker: "Cuentas de pista",
    listTitle: "Facturas",
    listIntro:
      "Combina fichas de la plantilla con productos de barra y servicios por puntos. El saldo neto suma lo que el club debe por servicios y resta el consumo de barra.",
    newInvoice: "Nueva factura",
    loadError: "No se pudieron cargar las facturas.",
    empty: "Aún no hay facturas.",
    createFirst: "Crear la primera cuenta",
    colDate: "Fecha",
    colRoster: "Plantilla",
    colStatus: "Estado",
    colLines: "Líneas",
    colTotal: "Saldo",
    edit: "Editar",
    profileFallback: (id: number) => `Ficha n.º ${id}`,
    formatLocale: "es",
    newPageBack: "← Volver a facturas",
    newKicker: "Nueva cuenta",
    newTitle: "Crear factura",
    newIntro:
      "Los servicios en puntos suman al saldo (pago del club a la ficha); los productos de barra restan (consumo).",
    editKicker: "Editar cuenta",
    editTitle: (id: number) => `Factura n.º ${id}`,
    invalid: "Factura no válida.",
    back: "Volver",
  },

  invoiceEditor: {
    loadError: "No se pudo cargar la factura.",
    backToTabs: "Volver a cuentas",
    rosterProfile: "Ficha de plantilla",
    date: "Fecha",
    status: "Estado",
    selectPlaceholder: "Seleccionar…",
    lines: "Líneas",
    addBarProduct: "+ Producto de barra",
    addServicePoints: "+ Servicio (puntos)",
    noProductsHint:
      "Aún no hay productos en el catálogo. Puedes añadir líneas de servicio (puntos); los productos de barra requieren datos en la API.",
    noLinesHint:
      "Aún no hay líneas. Añade un producto de barra o una línea de servicio.",
    barProduct: "Producto de barra",
    servicePoints: "Servicio · puntos",
    remove: "Quitar",
    product: "Producto",
    qty: "Cant.",
    unitPrice: "Precio unitario",
    serviceLabel: "Nombre del servicio",
    servicePlaceholder: "p. ej. Anfitriona VIP · escenario",
    pointsValue: "Puntos (valor)",
    lineEffectProduct: "Consumo (resta):",
    lineEffectService: "Servicio — pago club (suma):",
    draftTotal: "Saldo neto (provisional):",
    saveCreate: "Crear factura",
    saveUpdate: "Guardar factura",
    saving: "Guardando…",
    cancel: "Cancelar",
    deleteInvoice: "Eliminar factura",
    deleting: "Eliminando…",
    confirmDelete:
      "¿Eliminar esta factura y todas sus líneas? Esta acción no se puede deshacer.",
    saveError: "No se pudo guardar la factura.",
    deleteError: "No se pudo eliminar la factura.",
    validation: {
      chooseRoster: "Elige una ficha de plantilla.",
      setDate: "Indica una fecha.",
      productNeedsProduct: "Cada línea de barra necesita un producto.",
      qtyMin: "La cantidad debe ser al menos 1.",
      serviceNeedsLabel: "Cada línea de servicio necesita un nombre.",
      serviceNeedsPoints: "Las líneas de servicio necesitan un valor de puntos válido.",
    },
    statusOption: (s: InvoiceStatus) => {
      const map: Record<InvoiceStatus, string> = {
        draft: "Borrador",
        issued: "Emitida",
        paid: "Pagada",
        canceled: "Cancelada",
      };
      return map[s];
    },
  },

  invoiceStatus: {
    draft: "Borrador",
    issued: "Emitida",
    paid: "Pagada",
    canceled: "Cancelada",
  } satisfies Record<InvoiceStatus, string>,

  api: {
    couldNotCreateAccount: "No se pudo crear la cuenta.",
    signUpFailed: "Error al registrarse.",
    missingTokenOrUser: "Falta el token o el usuario en la respuesta.",
    invalidEmailOrPassword: "Correo o contraseña incorrectos.",
    loginFailed: "Error al iniciar sesión.",
    couldNotLoadProfile: "No se pudo cargar el perfil.",
    profileError: "Error de perfil.",
    couldNotLoadRoster: "No se pudo cargar la plantilla.",
    couldNotLoadProfileItem: "No se pudo cargar la ficha.",
    couldNotCreateProfile: "No se pudo crear la ficha.",
    couldNotUpdateProfile: "No se pudo actualizar la ficha.",
    couldNotRemoveProfile: "No se pudo eliminar la ficha.",
    couldNotLoadInvoices: "No se pudieron cargar las facturas.",
    couldNotLoadInvoice: "No se pudo cargar la factura.",
    couldNotCreateInvoice: "No se pudo crear la factura.",
    couldNotUpdateInvoice: "No se pudo actualizar la factura.",
    couldNotDeleteInvoice: "No se pudo eliminar la factura.",
    couldNotLoadProducts: "No se pudieron cargar los productos.",
    couldNotLoadProduct: "No se pudo cargar el producto.",
    couldNotCreateProduct: "No se pudo crear el producto.",
    couldNotUpdateProduct: "No se pudo actualizar el producto.",
    couldNotDeleteProduct: "No se pudo eliminar el producto.",
  },
} as const;

export function invoiceStatusLabel(status: string): string {
  if (status === "draft") return ui.invoiceStatus.draft;
  if (status === "issued") return ui.invoiceStatus.issued;
  if (status === "paid") return ui.invoiceStatus.paid;
  if (status === "canceled") return ui.invoiceStatus.canceled;
  return status;
}
