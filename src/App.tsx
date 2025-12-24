import { useState, useEffect } from 'react'
import './App.css'

// 1. กำหนด Interface ตามบทเรียน
interface PokemonStat {
    name: string;
    value: number;
}

interface Pokemon {
    id: number;
    name: string;
    types: string[];
    image: string;
    stats: PokemonStat[];
    weight: number;
    height: number;
}

const TYPE_COLORS: Record<string, string> = {
    normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C',
    grass: '#7AC74C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1',
    ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
    rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', dark: '#705746',
    steel: '#B7B7CE', fairy: '#D685AD',
};

function App() {
    // 2. ปรับ State เป็น Array
    const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // 3. ฟังก์ชันดึงข้อมูล 5 ตัวแรก
    const fetchFivePokemon = async () => {
        setLoading(true);
        try {
            // สร้างรายการ ID ที่ต้องการ (1 ถึง 5)
            const ids = [150, 6, 23, 710, 493];

            // ใช้ Promise.all เพื่อดึงข้อมูลพร้อมกัน (Parallel Fetch)
            const promises = ids.map(async (id) => {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
                const data = await response.json();
                return {
                    name: data.name,
                    id: data.id,
                    types: data.types.map((t: any) => t.type.name),
                    image: data.sprites.other['official-artwork'].front_default,
                    stats: data.stats.map((s: any) => ({ name: s.stat.name, value: s.base_stat })),
                    weight: data.weight,
                    height: data.height
                };
            });

            const results = await Promise.all(promises);
            setPokemonList(results);
        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    // ดึงข้อมูลเมื่อ Component โหลดครั้งแรก
    useEffect(() => {
        fetchFivePokemon();
    }, []);

    return (
        <div className="list-container">
            <h1 className="title">5 POKEMON</h1>

            {loading ? (
                <div className="loader">กำลังโหลดข้อมูล...</div>
            ) : (
                <div className="pokemon-grid">
                    {/* 4. ใช้ .map() เพื่อแสดงผลรายการ */}
                    {pokemonList.map((pokemon) => (
                        <div
                            key={pokemon.id}
                            className="pokemon-card"
                            style={{ borderTop: `10px solid ${TYPE_COLORS[pokemon.types[0]]}` }}
                        >
                            <div className="card-header">
                                <span className="id-tag">#{pokemon.id.toString().padStart(3, '0')}</span>
                                <h2 className="name">{pokemon.name.toUpperCase()}</h2>
                            </div>

                            <img src={pokemon.image} alt={pokemon.name} className="card-image" />

                            <div className="types">
                                {pokemon.types.map(t => (
                                    <span key={t} className="type-badge" style={{ backgroundColor: TYPE_COLORS[t] }}>
                                        {t.toUpperCase()}
                                    </span>
                                ))}
                            </div>

                            <div className="quick-stats">
                                <div><small>Height</small><p>{pokemon.height / 10} m</p></div>
                                <div><small>Weight</small><p>{pokemon.weight / 10} kg</p></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default App