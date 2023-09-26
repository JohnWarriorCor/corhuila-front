import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  selectedColor: string = 'default';
  usuario: Usuario;
  hide = true;
  ver = true;
  today = new Date();
  cargando: boolean = false;
  formLogin!: FormGroup;

  constructor(
    public authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.usuario = new Usuario();
  }

  ngOnInit() {
    this.crearFormularioLogin();
  }

  private crearFormularioLogin(): void {
    this.formLogin = this.formBuilder.group({
      usuario: new FormControl('', Validators.required),
      contrasenia: new FormControl('', Validators.required),
    });
  }

  setColor(color: string): void {
    this.selectedColor = color;
  }

  // Método para realizar el inicio de sesión del usuario
  login(): void {
    this.cargando = true;
    this.usuario.username = this.formLogin.get('usuario')!.value;
    this.usuario.password = this.formLogin.get('contrasenia')!.value;

    // Realizar la solicitud de inicio de sesión al servicio authService
    this.authService.login(this.usuario).subscribe(
      (response) => {
        // Si el inicio de sesión es exitoso, guardar el token y redirigir al usuario según el valor del parámetro web
        this.authService.guardarUsuario(response.access_token);
        this.authService.guardarToken(response.access_token);

        // Mostrar mensaje de éxito y redirigir
        Swal.fire({
          icon: 'success',
          title: 'Inicio de sesión exitoso.',
          confirmButtonColor: '#006983',
          confirmButtonText: 'Listo',
        });

        this.router.navigate(['/inicio']);
      },
      (err) => this.fError(err)
    );
  }
  // Método para manejar errores de inicio de sesión
  fError(er: { error: { error_description: any } }): void {
    let err = er.error.error_description;
    let arr: string[] = err.split(':');
    if (arr[0] == 'Access token expired') {
      // Si el token de acceso ha expirado, redirigir al usuario a la página de inicio de sesión
      this.router.navigate(['login']);
      this.cargando = false;
    } else {
      // Manejo de otros errores
      this.cargando = false;
    }
  }
}
