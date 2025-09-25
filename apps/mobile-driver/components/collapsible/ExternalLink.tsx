import { Href, Link } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import { type ComponentProps } from 'react';
import { Platform, Share, Alert } from 'react-native';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: Href & string };

export function ExternalLink({ href, ...rest }: Props) {
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Découvrez ce lien: ${href}`,
        url: href,
        title: 'Lien partagé',
      });
    } catch (error) {
      console.error('Erreur lors du partage:', error);
    }
  };

  const handleCopyLink = () => {
    Alert.alert('Lien copié', `Le lien ${href} a été copié dans le presse-papiers`);
  };

  const handleOpenInBrowser = async () => {
    try {
      await openBrowserAsync(href);
    } catch (error) {
      console.error('Erreur lors de l\'ouverture:', error);
    }
  };

  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      onPress={async (event) => {
        if (Platform.OS !== 'web') {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();
          // Open the link in an in-app browser.
          await openBrowserAsync(href);
        }
      }}
    >
      <Link.Trigger>
        {rest.children}
      </Link.Trigger>
      <Link.Preview />
      <Link.Menu>
        <Link.MenuAction 
          title="Ouvrir dans le navigateur" 
          icon="safari" 
          onPress={handleOpenInBrowser} 
        />
        <Link.MenuAction 
          title="Partager" 
          icon="square.and.arrow.up" 
          onPress={handleShare} 
        />
        <Link.MenuAction 
          title="Copier le lien" 
          icon="doc.on.doc" 
          onPress={handleCopyLink} 
        />
      </Link.Menu>
    </Link>
  );
}
