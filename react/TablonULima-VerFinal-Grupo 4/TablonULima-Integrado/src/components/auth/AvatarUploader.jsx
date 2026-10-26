import { useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { AVATAR_TYPES, MAX_AVATAR_MB, readFileAsDataUrl, resizeImage } from '../../utils/image';
import Avatar from './Avatar';

export default function AvatarUploader({ user }) {
  const { updateProfile } = useAuth();
  const { showToast } = useToast();
  const inputRef = useRef(null);

  const openPicker = () => inputRef.current.click();

  const handleChange = async e => {
    const file = e.target.files[0];
    e.target.value = '';                       // permite volver a elegir el mismo archivo
    if (!file) return;
    if (!AVATAR_TYPES.test(file.type)) return showToast('Elige una imagen PNG, JPG o WEBP.', 'error');
    if (file.size > MAX_AVATAR_MB * 1024 * 1024) return showToast(`La imagen no debe superar ${MAX_AVATAR_MB} MB.`, 'error');
    const foto = await resizeImage(await readFileAsDataUrl(file), 256);
    updateProfile({ foto });
    showToast('Foto de perfil actualizada.');
  };

  const removePhoto = () => {
    updateProfile({ foto: null });
    showToast('Foto eliminada.');
  };

  return (
    <>
      <Avatar
        user={user}
        className="avatar-edit"
        title="Cambiar foto"
        role="button"
        tabIndex={0}
        onClick={openPicker}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPicker(); } }}
      >
        <span className="avatar-overlay"><i className="fa-solid fa-camera" /></span>
      </Avatar>
      <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" style={{ display: 'none' }} onChange={handleChange} />
      {user.foto && (
        <button type="button" className="btn btn-ghost" style={{ margin: '8px auto 0' }} onClick={removePhoto}>Quitar foto</button>
      )}
    </>
  );
}
