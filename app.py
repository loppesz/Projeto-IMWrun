from flask import Flask, render_template

app = Flask(__name__)

# ── Páginas públicas ──────────────────────────────────────────────────────

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/corridas')
def corridas():
    return render_template('corridas.html')

@app.route('/ranking')
def ranking():
    return render_template('ranking.html')

@app.route('/corrida/<int:id>')
def corrida(id):
    return render_template('corrida.html', id=id)

@app.route('/perfil')
def perfil():
    return render_template('perfil.html')

@app.route('/login')
def login():
    return render_template('login.html')

# ── Admin ─────────────────────────────────────────────────────────────────

@app.route('/admin')
def admin():
    return render_template('admin/dashboard.html')

@app.route('/admin/login')
def admin_login():
    return render_template('admin/login.html')

@app.route('/admin/corridas')
def admin_corridas():
    return render_template('admin/corridas.html')

@app.route('/admin/inscritos')
def admin_inscritos():
    return render_template('admin/inscritos.html')

@app.route('/admin/grupos')
def admin_grupos():
    return render_template('admin/grupos.html')

@app.route('/admin/ao-vivo')
def admin_ao_vivo():
    return render_template('admin/ao_vivo.html')

if __name__ == '__main__':
    app.run(debug=True)
