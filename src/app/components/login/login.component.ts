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
  usuario: Usuario = new Usuario;
  hide = true;
  ver = true;
  today = new Date();
  cargando: boolean = false;
  formLogin!: FormGroup;
  uid: string = '';

  constructor(
    public authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.crearFormularioLogin();

    // Si el usuario ya ha iniciado sesión, redirigirlo a la página de inicio o de token según el caso
    if (this.authService.isAuthenticated()) {
      if (this.authService.codigoverificacion != null) {
        // Mostrar un mensaje de notificación si ya se ha iniciado sesión con un token de verificación
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });

        Toast.fire({
          icon: 'info',
          title: 'Ya se ha iniciado sesión.',
        });

        // Redirigir al usuario a la página de inicio
        this.router.navigate(['/inicio']);
      } else {
        // Redirigir al usuario a la página de inicio o de token según el valor del parámetro web
        this.router.navigate(['/inicio']);
      }
    }
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
    console.log('Entra login::',  this.formLogin.get('usuario')!.value);
    this.cargando = true;
    this.usuario.username = this.formLogin.get('usuario')!.value;
    this.usuario.password = this.formLogin.get('contrasenia')!.value;
    console.log(this.usuario);

    // Validar que no se ingresen campos de inicio de sesión vacíos
    if (this.usuario.username == null || this.usuario.password == null) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });

      // Mostrar un mensaje de error si se ingresan campos vacíos
      Toast.fire({
        icon: 'error',
        title: 'Error de inicio de sesión',
        text: 'Usuario o contraseña vacía',
      });

      this.cargando = false;
      return;
    }

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
          confirmButtonColor: '#8f141b',
          confirmButtonText: 'Listo',
          showClass: {
            popup: 'slide-top',
          },
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
