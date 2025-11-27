import type { Schema, Struct } from '@strapi/strapi';

export interface SectionsJejaring extends Struct.ComponentSchema {
  collectionName: 'components_sections_jejarings';
  info: {
    description: 'Component for networking preferences, used in StrapiAlumni.';
    displayName: 'Jejaring';
  };
  attributes: {
    alumniOfficerReady: Schema.Attribute.Enumeration<['ya', 'tidak']> &
      Schema.Attribute.DefaultTo<'tidak'>;
    contactPersonReady: Schema.Attribute.Enumeration<['ya', 'tidak']> &
      Schema.Attribute.DefaultTo<'tidak'>;
    otherContacts: Schema.Attribute.String;
  };
}

export interface SectionsKontak extends Struct.ComponentSchema {
  collectionName: 'components_sections_kontaks';
  info: {
    description: 'Component for contact information, used in StrapiAlumni.';
    displayName: 'Kontak';
  };
  attributes: {
    email: Schema.Attribute.Email;
    linkedin: Schema.Attribute.String;
    location: Schema.Attribute.Component<'sections.location', false>;
    phone: Schema.Attribute.String;
  };
}

export interface SectionsKontribusi extends Struct.ComponentSchema {
  collectionName: 'components_sections_kontribusis';
  info: {
    description: 'Component for contribution interests, used in StrapiAlumni.';
    displayName: 'Kontribusi';
  };
  attributes: {
    helpTopics: Schema.Attribute.String;
    willingToHelp: Schema.Attribute.JSON;
  };
}

export interface SectionsLainnya extends Struct.ComponentSchema {
  collectionName: 'components_sections_lainnyas';
  info: {
    description: 'Component for additional suggestions, used in StrapiAlumni.';
    displayName: 'Lainnya';
  };
  attributes: {
    suggestions: Schema.Attribute.String;
  };
}

export interface SectionsLocation extends Struct.ComponentSchema {
  collectionName: 'components_sections_locations';
  info: {
    description: 'Component for location details, used in KontakComponent.';
    displayName: 'Location';
  };
  attributes: {
    city: Schema.Attribute.String;
    country: Schema.Attribute.String;
  };
}

export interface SectionsMetadatum extends Struct.ComponentSchema {
  collectionName: 'components_sections_metadata';
  info: {
    description: 'Component for metadata related to alumni entry, used in StrapiAlumni.';
    displayName: 'Metadata';
  };
  attributes: {
    isPublic: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
  };
}

export interface SectionsPekerjaan extends Struct.ComponentSchema {
  collectionName: 'components_sections_pekerjaans';
  info: {
    description: 'Component for work details, used in StrapiAlumni.';
    displayName: 'Pekerjaan';
  };
  attributes: {
    currentEmployer: Schema.Attribute.String;
    position: Schema.Attribute.String;
    workField: Schema.Attribute.String;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'sections.jejaring': SectionsJejaring;
      'sections.kontak': SectionsKontak;
      'sections.kontribusi': SectionsKontribusi;
      'sections.lainnya': SectionsLainnya;
      'sections.location': SectionsLocation;
      'sections.metadatum': SectionsMetadatum;
      'sections.pekerjaan': SectionsPekerjaan;
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
    }
  }
}
