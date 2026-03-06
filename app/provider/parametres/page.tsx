// "use client";

// import { useEffect, useState } from "react";

// type Theme = "light" | "dark";
// type Lang = "fr" | "en";

// export default function ParametresPage() {

//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [role, setRole] = useState("");

//   const [theme, setTheme] = useState<Theme>("light");
//   const [lang, setLang] = useState<Lang>("fr");
//   const [avatarId, setAvatarId] = useState("1");

//   const [form, setForm] = useState({
//     first_name: "",
//     last_name: "",
//     email: "",
//     phone: ""
//   });

//   function applyTheme(t: Theme) {
//     if (t === "dark") {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//   }

//   function applyLang(l: Lang) {
//     document.documentElement.lang = l;
//   }

//   useEffect(() => {

//     const fn = localStorage.getItem("first_name") || "SuperAdmin";
//     const ln = localStorage.getItem("last_name") || "";
//     const em = localStorage.getItem("user_email") || "super-admin@canal.com";
//     const ph = localStorage.getItem("phone") || "";
//     const rl = localStorage.getItem("role") || "super-admin";

//     setFirstName(fn);
//     setLastName(ln);
//     setEmail(em);
//     setPhone(ph);
//     setRole(rl);

//     setForm({
//       first_name: fn,
//       last_name: ln,
//       email: em,
//       phone: ph
//     });

//     const st = (localStorage.getItem("theme") ?? "light") as Theme;
//     const sl = (localStorage.getItem("lang") ?? "fr") as Lang;
//     const sa = localStorage.getItem("avatarId") ?? "1";

//     setTheme(st);
//     setLang(sl);
//     setAvatarId(sa);

//     applyTheme(st);
//     applyLang(sl);

//   }, []);

//   function handleChange(e: React.ChangeEvent<HTMLInputElement>) {

//     const { name, value } = e.target;

//     setForm(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   }

//   function handleSaveProfile() {

//     localStorage.setItem("first_name", form.first_name);
//     localStorage.setItem("last_name", form.last_name);
//     localStorage.setItem("user_email", form.email);

//     if (form.phone) {
//       localStorage.setItem("phone", form.phone);
//       setPhone(form.phone);
//     }

//     setFirstName(form.first_name);
//     setLastName(form.last_name);
//     setEmail(form.email);

//     alert("Profil sauvegardé");
//   }

//   function handleThemeChange(t: Theme) {

//     setTheme(t);
//     localStorage.setItem("theme", t);
//     applyTheme(t);
//   }

//   function handleLangChange(l: Lang) {

//     setLang(l);
//     localStorage.setItem("lang", l);
//     applyLang(l);
//   }

//   function handleAvatarChange(id: string) {

//     setAvatarId(id);
//     localStorage.setItem("avatarId", id);
//   }

//   return (
//     <div className="max-w-3xl mx-auto p-6 space-y-8">

//       <h1 className="text-2xl font-bold">
//         Paramètres du compte
//       </h1>

//       <section className="space-y-4">

//         <h2 className="font-semibold">
//           Profil utilisateur
//         </h2>

//         <input
//           name="first_name"
//           value={form.first_name}
//           onChange={handleChange}
//           placeholder="Prénom"
//           className="border p-2 w-full rounded"
//         />

//         <input
//           name="last_name"
//           value={form.last_name}
//           onChange={handleChange}
//           placeholder="Nom"
//           className="border p-2 w-full rounded"
//         />

//         <input
//           name="email"
//           value={form.email}
//           onChange={handleChange}
//           placeholder="Email"
//           className="border p-2 w-full rounded"
//         />

//         <input
//           name="phone"
//           value={form.phone}
//           onChange={handleChange}
//           placeholder="Téléphone"
//           className="border p-2 w-full rounded"
//         />

//         <button
//           onClick={handleSaveProfile}
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           Sauvegarder
//         </button>

//       </section>

//       <section className="space-y-4">

//         <h2 className="font-semibold">
//           Apparence
//         </h2>

//         <div className="flex gap-4">

//           <button
//             onClick={() => handleThemeChange("light")}
//             className={`px-4 py-2 rounded border ${
//               theme === "light" ? "bg-gray-200" : ""
//             }`}
//           >
//             Clair
//           </button>

//           <button
//             onClick={() => handleThemeChange("dark")}
//             className={`px-4 py-2 rounded border ${
//               theme === "dark" ? "bg-gray-800 text-white" : ""
//             }`}
//           >
//             Sombre
//           </button>

//         </div>

//       </section>

//       <section className="space-y-4">

//         <h2 className="font-semibold">
//           Langue
//         </h2>

//         <div className="flex gap-4">

//           <button
//             onClick={() => handleLangChange("fr")}
//             className={`px-4 py-2 border rounded ${
//               lang === "fr" ? "bg-gray-200" : ""
//             }`}
//           >
//             Français
//           </button>

//           <button
//             onClick={() => handleLangChange("en")}
//             className={`px-4 py-2 border rounded ${
//               lang === "en" ? "bg-gray-200" : ""
//             }`}
//           >
//             English
//           </button>

//         </div>

//       </section>

//       <section className="space-y-4">

//         <h2 className="font-semibold">
//           Avatar
//         </h2>

//         <div className="flex gap-4">

//           {["1","2","3","4"].map(id => (
//             <button
//               key={id}
//               onClick={() => handleAvatarChange(id)}
//               className={`border rounded-full p-4 ${
//                 avatarId === id ? "ring-2 ring-blue-500" : ""
//               }`}
//             >
//               {id}
//             </button>
//           ))}

//         </div>

//       </section>

//       <section className="text-sm text-gray-500">

//         <p>
//           Rôle : {role}
//         </p>

//       </section>

//     </div>
//   );
// }