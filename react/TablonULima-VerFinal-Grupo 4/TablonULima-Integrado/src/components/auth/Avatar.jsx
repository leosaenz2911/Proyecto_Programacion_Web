// Solo muestra: iniciales o foto. Para subir foto usa <AvatarUploader />.
export default function Avatar({ user, size = 'md', className = '', children, ...rest }) {
  const base = size === 'sm' ? 'avatar-sm' : 'avatar';
  const style = user.foto ? { backgroundImage: `url(${user.foto})` } : undefined;
  const initials = (user.nombres[0] + user.apellidos[0]).toUpperCase();
  return (
    <div className={[base, user.foto ? 'has-photo' : '', className].filter(Boolean).join(' ')} style={style} {...rest}>
      {!user.foto && initials}
      {children}
    </div>
  );
}
