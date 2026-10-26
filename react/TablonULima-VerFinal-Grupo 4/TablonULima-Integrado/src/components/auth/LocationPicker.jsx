import { PUNTOS_ENCUENTRO } from '../../utils/constants';

export default function LocationPicker({ value, onChange }) {
  return (
    <div className="chips">
      {PUNTOS_ENCUENTRO.map(p => (
        <button key={p} type="button" className={`chip${value === p ? ' active' : ''}`} onClick={() => onChange(p)}>{p}</button>
      ))}
    </div>
  );
}
