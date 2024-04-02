import { NavLink } from "react-router-dom";
function Header() {
  return (
    <header>
      <h1>Admin</h1>
      <nav>
        <NavLink to="/">Accueil</NavLink>
        <NavLink to="/admin/users">Utilisateurs</NavLink>
        <NavLink to="/admin/roles">Roles</NavLink>
        <NavLink to="/admin/permissions">Permissions</NavLink>
        <NavLink to="/admin/parameters">Paramètres</NavLink>
      </nav>
    </header>
  );
}

export default Header;
